import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Monitor, Calendar, Clock, Shield, HardDrive, RefreshCw, Info, Server, Ship as Chip } from 'lucide-react';
import { useMachines } from '../context/MachinesContext';
import StatusBadge from '../components/StatusBadge';

const MachineDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { machines } = useMachines();
  
  const machine = machines.find(m => m.machineId === id);
  
  if (!machine) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Machine Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">The machine with ID {id} could not be found or is no longer reporting.</p>
        <Link 
          to="/"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }
  
  // Format time
  const lastCheckin = new Date(machine.timestamp);
  const formattedDate = lastCheckin.toLocaleString();
  
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
    <div>
      <div className="flex items-center mb-6">
        <Link 
          to="/"
          className="mr-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{machine.hostname}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Machine Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Monitor className="mr-2 h-5 w-5 text-blue-500" />
            Machine Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Hostname</div>
              <div className="text-base text-gray-900 dark:text-white">{machine.hostname}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Model</div>
              <div className="text-base text-gray-900 dark:text-white">{machine.model}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Operating System</div>
              <div className="text-base text-gray-900 dark:text-white">
                {os.icon} {os.name} {machine.osVersion}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Machine ID</div>
              <div className="text-sm font-mono text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {machine.machineId}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Last Check-in</div>
              <div className="text-base text-gray-900 dark:text-white flex items-center">
                <Calendar className="mr-1.5 h-4 w-4 text-gray-500" />
                {formattedDate}
              </div>
            </div>
          </div>
        </div>
        
        {/* System Health Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Info className="mr-2 h-5 w-5 text-blue-500" />
            System Health Status
          </h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <HardDrive className="mr-2 h-5 w-5 text-gray-500" />
                  <span className="text-gray-900 dark:text-white font-medium">Disk Encryption</span>
                </div>
                <StatusBadge 
                  status={machine.checks.diskEncryption.encrypted ? 'success' : 'error'} 
                  text={machine.checks.diskEncryption.encrypted ? 'Encrypted' : 'Unencrypted'} 
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded">
                {machine.checks.diskEncryption.details}
              </p>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <RefreshCw className="mr-2 h-5 w-5 text-gray-500" />
                  <span className="text-gray-900 dark:text-white font-medium">OS Updates</span>
                </div>
                <StatusBadge 
                  status={machine.checks.osUpdates.upToDate ? 'success' : 'warning'} 
                  text={machine.checks.osUpdates.upToDate ? 'Up to date' : 'Updates available'} 
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded">
                {machine.checks.osUpdates.details}
              </p>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-gray-500" />
                  <span className="text-gray-900 dark:text-white font-medium">Antivirus</span>
                </div>
                <StatusBadge 
                  status={machine.checks.antivirus.enabled ? 'success' : machine.checks.antivirus.installed ? 'warning' : 'error'} 
                  text={machine.checks.antivirus.enabled ? 'Protected' : machine.checks.antivirus.installed ? 'Disabled' : 'Not installed'} 
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded">
                {machine.checks.antivirus.details}
              </p>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-gray-500" />
                  <span className="text-gray-900 dark:text-white font-medium">Sleep Settings</span>
                </div>
                <StatusBadge 
                  status={machine.checks.sleepSettings.compliant ? 'success' : 'warning'} 
                  text={machine.checks.sleepSettings.compliant ? 'Compliant' : 'Non-compliant'} 
                  details={`${machine.checks.sleepSettings.timeoutMinutes} min`}
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded">
                {machine.checks.sleepSettings.details}
              </p>
              {!machine.checks.sleepSettings.compliant && (
                <div className="mt-2 text-sm text-orange-600 dark:text-orange-400">
                  <span className="font-semibold">Recommendation:</span> Configure sleep settings to ≤ 10 minutes for better security and energy efficiency.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hardware Information Card - Placeholder since we don't collect this */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Chip className="mr-2 h-5 w-5 text-blue-500" />
            Hardware Information
          </h2>
          
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-3 mb-4">
              <Chip className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-gray-700 dark:text-gray-300 font-medium mb-2">Hardware details not collected</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              The system utility does not currently collect detailed hardware information.
              This could be implemented in a future update.
            </p>
          </div>
        </div>
        
        {/* Network Information Card - Placeholder since we don't collect this */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Server className="mr-2 h-5 w-5 text-blue-500" />
            Network Information
          </h2>
          
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-3 mb-4">
              <Server className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-gray-700 dark:text-gray-300 font-medium mb-2">Network details not collected</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              The system utility does not currently collect network information.
              This could be implemented in a future update.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineDetail;