import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { FilterOptions } from '../context/MachinesContext';

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
  totalMachines: number;
  filteredCount: number;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, totalMachines, filteredCount }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [platform, setPlatform] = useState('all');
  const [status, setStatus] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(value, platform, status);
  };
  
  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setPlatform(value);
    applyFilters(searchTerm, value, status);
  };
  
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'all' | 'healthy' | 'issues';
    setStatus(value);
    applyFilters(searchTerm, platform, value);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setPlatform('all');
    setStatus('all');
    applyFilters('', 'all', 'all');
  };
  
  const applyFilters = (
    search: string, 
    selectedPlatform: string, 
    selectedStatus: 'all' | 'healthy' | 'issues'
  ) => {
    onFilterChange({
      search,
      platform: selectedPlatform,
      status: selectedStatus
    });
  };

  const isFiltered = searchTerm !== '' || platform !== 'all' || status !== 'all';
  
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500"
            placeholder="Search by hostname, model, or ID..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <Filter className="mr-1.5 h-4 w-4" />
            Filters
          </button>
          
          {isFiltered && (
            <button
              onClick={clearFilters}
              className="flex items-center text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
            >
              <X className="mr-1 h-4 w-4" />
              Clear
            </button>
          )}
          
          <div className="ml-auto md:ml-0 text-sm text-gray-500 dark:text-gray-400">
            {filteredCount === totalMachines 
              ? `${totalMachines} machine${totalMachines !== 1 ? 's' : ''}` 
              : `${filteredCount} of ${totalMachines} machines`}
          </div>
        </div>
      </div>
      
      {isFilterOpen && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="platform-filter" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Platform
            </label>
            <select
              id="platform-filter"
              value={platform}
              onChange={handlePlatformChange}
              className="block w-full px-3 py-2 text-sm text-gray-900 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500"
            >
              <option value="all">All Platforms</option>
              <option value="darwin">macOS</option>
              <option value="win32">Windows</option>
              <option value="linux">Linux</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="status-filter" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              id="status-filter"
              value={status}
              onChange={handleStatusChange}
              className="block w-full px-3 py-2 text-sm text-gray-900 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="healthy">Healthy</option>
              <option value="issues">Has Issues</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;