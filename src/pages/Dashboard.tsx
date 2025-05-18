import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  HardDrive, 
  RefreshCw, 
  Clock, 
  Download,
  Laptop
} from 'lucide-react';
import { useMachines, FilterOptions } from '../context/MachinesContext';
import MachineCard from '../components/MachineCard';
import FilterBar from '../components/FilterBar';
import StatCard from '../components/StatCard';
import { Machine } from '../types/Machine';

const Dashboard: React.FC = () => {
  const { machines, loading, filterMachines } = useMachines();
  const [filters, setFilters] = useState<FilterOptions>({});
  const [filteredMachines, setFilteredMachines] = useState<Machine[]>([]);
  
  useEffect(() => {
    setFilteredMachines(filterMachines(filters));
  }, [filters, machines]);
  
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };
  
  // Calculate stats
  const totalMachines = machines.length;
  
  const encryptedCount = machines.filter(m => 
    m.checks.diskEncryption.encrypted
  ).length;
  
  const encryptionRate = totalMachines > 0 
    ? Math.round((encryptedCount / totalMachines) * 100) 
    : 0;
  
  const upToDateCount = machines.filter(m => 
    m.checks.osUpdates.upToDate
  ).length;
  
  const updateComplianceRate = totalMachines > 0 
    ? Math.round((upToDateCount / totalMachines) * 100) 
    : 0;
  
  const antivirusCount = machines.filter(m => 
    m.checks.antivirus.enabled
  ).length;
  
  const antivirusRate = totalMachines > 0 
    ? Math.round((antivirusCount / totalMachines) * 100) 
    : 0;
  
  const sleepCompliantCount = machines.filter(m => 
    m.checks.sleepSettings.compliant
  ).length;
  
  const sleepComplianceRate = totalMachines > 0 
    ? Math.round((sleepCompliantCount / totalMachines) * 100) 
    : 0;
  
  const fullCompliantCount = machines.filter(m => 
    m.checks.diskEncryption.encrypted && 
    m.checks.osUpdates.upToDate && 
    m.checks.antivirus.enabled && 
    m.checks.sleepSettings.compliant
  ).length;
  
  const fullComplianceRate = totalMachines > 0 
    ? Math.round((fullCompliantCount / totalMachines) * 100) 
    : 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">System Health Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Monitor and manage system health across all your devices
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <StatCard 
          title="Total Machines" 
          value={totalMachines} 
          icon={<Laptop size={24} />} 
          color="blue"
        />
        
        <StatCard 
          title="Disk Encryption" 
          value={`${encryptionRate}%`} 
          icon={<HardDrive size={24} />} 
          color={encryptionRate >= 90 ? 'green' : encryptionRate >= 70 ? 'orange' : 'red'}
        />
        
        <StatCard 
          title="OS Updates" 
          value={`${updateComplianceRate}%`} 
          icon={<RefreshCw size={24} />} 
          color={updateComplianceRate >= 90 ? 'green' : updateComplianceRate >= 70 ? 'orange' : 'red'}
        />
        
        <StatCard 
          title="Antivirus" 
          value={`${antivirusRate}%`} 
          icon={<Shield size={24} />} 
          color={antivirusRate >= 90 ? 'green' : antivirusRate >= 70 ? 'orange' : 'red'}
        />
        
        <StatCard 
          title="Sleep Settings" 
          value={`${sleepComplianceRate}%`} 
          icon={<Clock size={24} />} 
          color={sleepComplianceRate >= 90 ? 'green' : sleepComplianceRate >= 70 ? 'orange' : 'red'}
        />
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Machines</h2>
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            alert('CSV export functionality would be implemented here');
          }}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <Download size={16} className="mr-1.5" />
          Export as CSV
        </a>
      </div>
      
      <FilterBar 
        onFilterChange={handleFilterChange} 
        totalMachines={machines.length} 
        filteredCount={filteredMachines.length} 
      />
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredMachines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMachines.map(machine => (
            <MachineCard key={machine.machineId} machine={machine} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <Laptop className="h-8 w-8 text-gray-500 dark:text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No machines found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            {machines.length > 0 
              ? "No machines match your current filters. Try adjusting your search criteria."
              : "No machines are currently reporting to the system. Ensure your system utility is properly installed and running."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;