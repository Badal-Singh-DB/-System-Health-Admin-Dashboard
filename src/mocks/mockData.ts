import { Machine } from '../types/Machine';
import { v4 as uuidv4 } from 'uuid';

export const mockMachines: Machine[] = [
  {
    machineId: uuidv4(),
    timestamp: new Date().toISOString(),
    hostname: "macbook-pro-1",
    platform: "darwin",
    osVersion: "21.6.0",
    model: "MacBookPro18,3",
    checks: {
      diskEncryption: {
        encrypted: true,
        details: "FileVault is On for this volume"
      },
      osUpdates: {
        upToDate: true,
        details: "System is up to date"
      },
      antivirus: {
        installed: true,
        enabled: true,
        details: "XProtect (built-in)"
      },
      sleepSettings: {
        compliant: true,
        timeoutMinutes: 5,
        details: "Display sleep: 5 min, System sleep: 15 min"
      }
    }
  },
  {
    machineId: uuidv4(),
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    hostname: "win-desktop-2",
    platform: "win32",
    osVersion: "10.0.19044",
    model: "Surface Laptop 4",
    checks: {
      diskEncryption: {
        encrypted: false,
        details: "BitLocker: Off"
      },
      osUpdates: {
        upToDate: false,
        details: "3 updates available"
      },
      antivirus: {
        installed: true,
        enabled: true,
        details: "Windows Defender: Installed, Real-time protection: Enabled"
      },
      sleepSettings: {
        compliant: false,
        timeoutMinutes: 30,
        details: "Screen timeout: 30 min"
      }
    }
  },
  {
    machineId: uuidv4(),
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    hostname: "ubuntu-server-1",
    platform: "linux",
    osVersion: "22.04",
    model: "Dell XPS 13",
    checks: {
      diskEncryption: {
        encrypted: true,
        details: "LUKS encryption detected"
      },
      osUpdates: {
        upToDate: false,
        details: "8 updates available"
      },
      antivirus: {
        installed: false,
        enabled: false,
        details: "No antivirus detected"
      },
      sleepSettings: {
        compliant: true,
        timeoutMinutes: 10,
        details: "Screen timeout: 10 min"
      }
    }
  },
  {
    machineId: uuidv4(),
    timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
    hostname: "imac-design-dept",
    platform: "darwin",
    osVersion: "14.0.0",
    model: "iMac22,1",
    checks: {
      diskEncryption: {
        encrypted: true,
        details: "FileVault is On for this volume"
      },
      osUpdates: {
        upToDate: true,
        details: "System is up to date"
      },
      antivirus: {
        installed: true,
        enabled: true,
        details: "XProtect (built-in)"
      },
      sleepSettings: {
        compliant: true,
        timeoutMinutes: 8,
        details: "Display sleep: 8 min, System sleep: 20 min"
      }
    }
  },
  {
    machineId: uuidv4(),
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    hostname: "win-laptop-sales",
    platform: "win32",
    osVersion: "11.0.22000",
    model: "ThinkPad X1 Carbon",
    checks: {
      diskEncryption: {
        encrypted: true,
        details: "BitLocker: On"
      },
      osUpdates: {
        upToDate: false,
        details: "1 update available"
      },
      antivirus: {
        installed: true,
        enabled: false,
        details: "Windows Defender: Installed, Real-time protection: Disabled"
      },
      sleepSettings: {
        compliant: false,
        timeoutMinutes: 20,
        details: "Screen timeout: 20 min"
      }
    }
  }
];