import React, { useState } from 'react';
import { useApi } from '../context/ApiContext';
import { useMachines } from '../context/MachinesContext';
import { Save, RefreshCw, Globe, Clock } from 'lucide-react';

const Settings: React.FC = () => {
  const { apiUrl, setApiUrl } = useApi();
  const { fetchMachines } = useMachines();
  
  const [newApiUrl, setNewApiUrl] = useState(apiUrl);
  const [checkInterval, setCheckInterval] = useState('30');
  const [apiSaved, setApiSaved] = useState(false);
  const [intervalSaved, setIntervalSaved] = useState(false);
  
  const handleApiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiUrl(newApiUrl);
    setApiSaved(true);
    setTimeout(() => setApiSaved(false), 3000);
    
    // Refresh data
    fetchMachines();
  };
  
  const handleIntervalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would normally update the electron store
    setIntervalSaved(true);
    setTimeout(() => setIntervalSaved(false), 3000);
    
    // Simulate updating the check interval
    console.log(`Check interval set to ${checkInterval} minutes`);
  };
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Configure system preferences and connection settings
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* API Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Globe className="mr-2 h-5 w-5 text-blue-500" />
            API Connection
          </h2>
          
          <form onSubmit={handleApiSubmit}>
            <div className="mb-4">
              <label htmlFor="api-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                API Endpoint URL
              </label>
              <input
                type="url"
                id="api-url"
                value={newApiUrl}
                onChange={(e) => setNewApiUrl(e.target.value)}
                className="block w-full px-3 py-2 text-gray-900 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500"
                placeholder="https://api.example.com"
                required
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                URL for the health data reporting endpoint
              </p>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
              >
                <Save className="mr-2 h-4 w-4" />
                Save API URL
              </button>
              
              <button
                type="button"
                onClick={fetchMachines}
                className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Data
              </button>
            </div>
            
            {apiSaved && (
              <div className="mt-3 text-sm text-green-600 dark:text-green-400">
                API URL saved successfully!
              </div>
            )}
          </form>
        </div>
        
        {/* Check Interval Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Clock className="mr-2 h-5 w-5 text-blue-500" />
            Check Interval
          </h2>
          
          <form onSubmit={handleIntervalSubmit}>
            <div className="mb-4">
              <label htmlFor="check-interval" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Check Interval (minutes)
              </label>
              <select
                id="check-interval"
                value={checkInterval}
                onChange={(e) => setCheckInterval(e.target.value)}
                className="block w-full px-3 py-2 text-gray-900 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
              </select>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                How often the system utility checks system health
              </p>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Interval
              </button>
            </div>
            
            {intervalSaved && (
              <div className="mt-3 text-sm text-green-600 dark:text-green-400">
                Check interval saved successfully!
              </div>
            )}
          </form>
        </div>
      </div>
      
      {/* About Section */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About System Health Monitor</h2>
        
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p>
            Version 1.0.0
          </p>
          <p>
            System Health Monitor is a cross-platform utility for monitoring and managing system health across multiple devices.
            It collects data on disk encryption, OS updates, antivirus status, and sleep settings to ensure your systems
            meet security and compliance requirements.
          </p>
          <h3>Features</h3>
          <ul>
            <li>Cross-platform support for macOS, Windows, and Linux</li>
            <li>Automated system health checks</li>
            <li>Centralized monitoring dashboard</li>
            <li>Filtering and sorting capabilities</li>
            <li>Issue flagging and recommendations</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Settings;