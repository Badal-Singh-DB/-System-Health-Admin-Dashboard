import os from 'os';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Check disk encryption status
async function checkDiskEncryption() {
  try {
    switch (process.platform) {
      case 'darwin': // macOS
        const { stdout: filevaultStatus } = await execPromise('fdesetup status');
        return {
          encrypted: filevaultStatus.includes('FileVault is On'),
          details: filevaultStatus.trim()
        };
        
      case 'win32': // Windows
        const { stdout: bitlockerStatus } = await execPromise('powershell -command "Get-BitLockerVolume | Select-Object -Property MountPoint,ProtectionStatus | ConvertTo-Json"');
        const volumes = JSON.parse(bitlockerStatus);
        const systemDrive = Array.isArray(volumes) 
          ? volumes.find(v => v.MountPoint.includes('C:')) 
          : volumes;
        
        return {
          encrypted: systemDrive ? systemDrive.ProtectionStatus === 1 : false,
          details: `BitLocker: ${systemDrive ? (systemDrive.ProtectionStatus === 1 ? 'On' : 'Off') : 'Unknown'}`
        };
        
      case 'linux': // Linux
        // Check for common encryption tools (LUKS)
        const { stdout: luksStatus } = await execPromise('lsblk -f');
        return {
          encrypted: luksStatus.includes('crypto_LUKS'),
          details: luksStatus.includes('crypto_LUKS') ? 'LUKS encryption detected' : 'No encryption detected'
        };
        
      default:
        return {
          encrypted: false,
          details: 'Unsupported platform'
        };
    }
  } catch (error) {
    console.error('Error checking disk encryption:', error);
    return {
      encrypted: false,
      details: `Error: ${error.message}`
    };
  }
}

// Check OS update status
async function checkOsUpdates() {
  try {
    switch (process.platform) {
      case 'darwin': // macOS
        const { stdout: swUpdate } = await execPromise('softwareupdate -l');
        const needsUpdates = !swUpdate.includes('No new software available');
        
        return {
          upToDate: !needsUpdates,
          details: needsUpdates ? swUpdate.trim() : 'System is up to date'
        };
        
      case 'win32': // Windows
        const { stdout: winUpdates } = await execPromise('powershell -command "Get-WindowsUpdate | Measure-Object | Select-Object -ExpandProperty Count"');
        const updateCount = parseInt(winUpdates.trim(), 10);
        
        return {
          upToDate: updateCount === 0,
          details: updateCount > 0 ? `${updateCount} updates available` : 'System is up to date'
        };
        
      case 'linux': // Linux
        if (fs.existsSync('/etc/debian_version')) {
          // Debian/Ubuntu
          const { stdout: aptUpdates } = await execPromise('apt-get -s upgrade | grep -P "^\\d+ upgraded"');
          const match = aptUpdates.match(/^(\d+) upgraded/);
          const updateCount = match ? parseInt(match[1], 10) : 0;
          
          return {
            upToDate: updateCount === 0,
            details: updateCount > 0 ? `${updateCount} updates available` : 'System is up to date'
          };
        } else if (fs.existsSync('/etc/fedora-release') || fs.existsSync('/etc/redhat-release')) {
          // Fedora/RHEL/CentOS
          const { stdout: dnfUpdates } = await execPromise('dnf check-update --quiet | wc -l');
          const updateCount = parseInt(dnfUpdates.trim(), 10);
          
          return {
            upToDate: updateCount === 0,
            details: updateCount > 0 ? `${updateCount} updates available` : 'System is up to date'
          };
        } else {
          return {
            upToDate: false,
            details: 'Unsupported Linux distribution'
          };
        }
        
      default:
        return {
          upToDate: false,
          details: 'Unsupported platform'
        };
    }
  } catch (error) {
    console.error('Error checking OS updates:', error);
    return {
      upToDate: false,
      details: `Error: ${error.message}`
    };
  }
}

// Check antivirus status
async function checkAntivirus() {
  try {
    switch (process.platform) {
      case 'darwin': // macOS
        // macOS has built-in XProtect
        return {
          installed: true,
          enabled: true,
          details: 'XProtect (built-in)'
        };
        
      case 'win32': // Windows
        // Check Windows Defender status
        const { stdout: defenderStatus } = await execPromise('powershell -command "Get-MpComputerStatus | Select-Object -Property AntivirusEnabled,RealTimeProtectionEnabled | ConvertTo-Json"');
        const status = JSON.parse(defenderStatus);
        
        return {
          installed: true,
          enabled: status.AntivirusEnabled && status.RealTimeProtectionEnabled,
          details: `Windows Defender: ${status.AntivirusEnabled ? 'Installed' : 'Not installed'}, Real-time protection: ${status.RealTimeProtectionEnabled ? 'Enabled' : 'Disabled'}`
        };
        
      case 'linux': // Linux
        // Check for common antivirus solutions
        const { stdout: clamavStatus } = await execPromise('which clamav || which clamdscan || echo "not found"');
        const hasClamAV = !clamavStatus.includes('not found');
        
        return {
          installed: hasClamAV,
          enabled: hasClamAV, // Assume enabled if installed
          details: hasClamAV ? 'ClamAV detected' : 'No antivirus detected'
        };
        
      default:
        return {
          installed: false,
          enabled: false,
          details: 'Unsupported platform'
        };
    }
  } catch (error) {
    console.error('Error checking antivirus:', error);
    return {
      installed: false,
      enabled: false,
      details: `Error: ${error.message}`
    };
  }
}

// Check inactivity sleep settings
async function checkSleepSettings() {
  try {
    let sleepMinutes = 0;
    let details = '';
    
    switch (process.platform) {
      case 'darwin': // macOS
        const { stdout: pmset } = await execPromise('pmset -g');
        const displayMatch = pmset.match(/displaysleep\s+(\d+)/);
        const systemMatch = pmset.match(/sleep\s+(\d+)/);
        
        sleepMinutes = Math.min(
          displayMatch ? parseInt(displayMatch[1], 10) : Infinity,
          systemMatch ? parseInt(systemMatch[1], 10) : Infinity
        );
        details = `Display sleep: ${displayMatch ? displayMatch[1] : 'unknown'} min, System sleep: ${systemMatch ? systemMatch[1] : 'unknown'} min`;
        break;
        
      case 'win32': // Windows
        const { stdout: powerCfg } = await execPromise('powercfg /q SCHEME_CURRENT SUB_VIDEO VIDEOIDLE');
        const match = powerCfg.match(/AC Power Setting Index: 0x(\w+)/);
        if (match) {
          sleepMinutes = parseInt(match[1], 16) / 60; // Convert seconds to minutes
        }
        details = `Screen timeout: ${sleepMinutes} min`;
        break;
        
      case 'linux': // Linux
        const { stdout: xset } = await execPromise('xset q');
        const xsetMatch = xset.match(/timeout:\s+(\d+)/);
        if (xsetMatch) {
          sleepMinutes = parseInt(xsetMatch[1], 10) / 60; // Convert seconds to minutes
        }
        details = `Screen timeout: ${sleepMinutes} min`;
        break;
        
      default:
        details = 'Unsupported platform';
        break;
    }
    
    return {
      compliant: sleepMinutes > 0 && sleepMinutes <= 10,
      timeoutMinutes: sleepMinutes,
      details
    };
  } catch (error) {
    console.error('Error checking sleep settings:', error);
    return {
      compliant: false,
      timeoutMinutes: 0,
      details: `Error: ${error.message}`
    };
  }
}

// Main function to collect all system health data
export async function checkSystemHealth(machineId) {
  const diskEncryption = await checkDiskEncryption();
  const osUpdates = await checkOsUpdates();
  const antivirus = await checkAntivirus();
  const sleepSettings = await checkSleepSettings();
  
  return {
    machineId,
    timestamp: new Date().toISOString(),
    hostname: os.hostname(),
    platform: process.platform,
    osVersion: os.release(),
    model: await getMachineModel(),
    checks: {
      diskEncryption,
      osUpdates,
      antivirus,
      sleepSettings
    }
  };
}

// Helper function to get machine model
async function getMachineModel() {
  try {
    switch (process.platform) {
      case 'darwin': // macOS
        const { stdout: model } = await execPromise('sysctl -n hw.model');
        return model.trim();
        
      case 'win32': // Windows
        const { stdout: winModel } = await execPromise('wmic csproduct get name');
        return winModel.split('\n')[1].trim();
        
      case 'linux': // Linux
        if (fs.existsSync('/sys/devices/virtual/dmi/id/product_name')) {
          return fs.readFileSync('/sys/devices/virtual/dmi/id/product_name', 'utf8').trim();
        }
        return 'Unknown Linux Machine';
        
      default:
        return 'Unknown Machine';
    }
  } catch (error) {
    console.error('Error getting machine model:', error);
    return 'Unknown';
  }
}