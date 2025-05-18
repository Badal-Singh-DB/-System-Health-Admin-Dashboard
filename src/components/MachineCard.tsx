import React from 'react';
import { Link } from 'react-router-dom';
import { Machine } from '../types/Machine';
import { Monitor, Calendar, ArrowRight } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface MachineCardProps {
  machine: Machine;
}

const MachineCard: React.FC<MachineCardProps> = ({ machine }) => {
  const { checks } = machine;
  
  // Format last check-in time
  const lastCheckin = new Date(machine.timestamp);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - lastCheckin.getTime()) / (1000 * 60));
  
  let timeDisplay;
  if (diffMinutes < 1) {
    timeDisplay = 'Just now';
  } else if (diffMinutes < 60) {
    timeDisplay = `${diffMinutes} min${diffMinutes === 1 ? '' : 's'} ago`;
  } else if (diffMinutes < 24 * 60) {
    const hours = Math.floor(diffMinutes / 60);
    timeDisplay = `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else {
    const days = Math.floor(diffMinutes / (24 * 60));
    timeDisplay = `${days} day${days === 1 ? '' : 's'} ago`;
  }
  
  // Determine overall system status
  const hasIssues = !checks.diskEncryption.encrypted || 
                    !checks.osUpdates.upToDate || 
                    !checks.antivirus.enabled || 
                    !checks.sleepSettings.compliant;
  
  const severeIssues = (!checks.diskEncryption.encrypted && !checks.antivirus.enabled) || 
                       (!checks.diskEncryption.encrypted && !checks.osUpdates.upToDate);
  
  let overallStatus = 'success';
  if (severeIssues) overallStatus = 'error';
  else if (hasIssues) overallStatus = 'warning';

  // Get OS icon and name
  const getOsDetails = () => {
    switch (machine.platform) {
      case 'darwin':
        return { name: 'macOS', icon: '🍎' };
      case 'win32':
        return { name: 'Windows', icon: '🪟' };
      case 'linux':
        return { name: 'Linux', icon: '🐧' };
      default:
        return { name: 'Unknown OS', icon: '💻' };
    }
  };
  
  const os = getOsDetails();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 mr-3">
              <Monitor size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{machine.hostname}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{os.icon} {os.name} {machine.osVersion}</p>
            </div>
          </div>
          
          <StatusBadge 
            status={overallStatus as 'success' | 'warning' | 'error'} 
            text={severeIssues ? 'Critical' : hasIssues ? 'Issues' : 'Healthy'} 
            size="sm"
          />
        </div>
        
        <div className="space-y-3 mb-5">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-300">Disk Encryption</span>
            <StatusBadge 
              status={checks.diskEncryption.encrypted ? 'success' : 'error'} 
              text={checks.diskEncryption.encrypted ? 'Encrypted' : 'Unencrypted'} 
              size="sm"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-300">OS Updates</span>
            <StatusBadge 
              status={checks.osUpdates.upToDate ? 'success' : 'warning'} 
              text={checks.osUpdates.upToDate ? 'Up to date' : 'Updates available'} 
              size="sm"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-300">Antivirus</span>
            <StatusBadge 
              status={checks.antivirus.enabled ? 'success' : checks.antivirus.installed ? 'warning' : 'error'} 
              text={checks.antivirus.enabled ? 'Protected' : checks.antivirus.installed ? 'Disabled' : 'Not installed'} 
              size="sm"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-300">Sleep Settings</span>
            <StatusBadge 
              status={checks.sleepSettings.compliant ? 'success' : 'warning'} 
              text={checks.sleepSettings.compliant ? 'Compliant' : 'Non-compliant'} 
              details={`${checks.sleepSettings.timeoutMinutes} min`}
              size="sm"
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center border-t dark:border-gray-700 pt-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Calendar size={14} className="mr-1" />
            Last check: {timeDisplay}
          </div>
          
          <Link 
            to={`/machine/${machine.machineId}`}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Details <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MachineCard;