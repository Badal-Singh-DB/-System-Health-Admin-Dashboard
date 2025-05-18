import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useApi } from './ApiContext';
import { Machine } from '../types/Machine';
import { mockMachines } from '../mocks/mockData';

type MachinesContextType = {
  machines: Machine[];
  loading: boolean;
  error: string | null;
  fetchMachines: () => Promise<void>;
  filterMachines: (filters: FilterOptions) => Machine[];
};

export type FilterOptions = {
  platform?: string;
  status?: 'healthy' | 'issues' | 'all';
  search?: string;
};

const MachinesContext = createContext<MachinesContextType>({
  machines: [],
  loading: false,
  error: null,
  fetchMachines: async () => {},
  filterMachines: () => [],
});

export const useMachines = () => useContext(MachinesContext);

export const MachinesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { apiUrl } = useApi();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMachines = async () => {
    setLoading(true);
    setError(null);
    try {
      // Try to fetch from API
      try {
        const response = await axios.get(`${apiUrl}/machines`);
        setMachines(response.data);
      } catch (err) {
        console.log('API fetch failed, using mock data');
        // If API fails, use mock data
        setMachines(mockMachines);
      }
    } catch (err) {
      setError('Failed to fetch machines data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterMachines = (filters: FilterOptions): Machine[] => {
    return machines.filter(machine => {
      // Filter by platform
      if (filters.platform && filters.platform !== 'all' && machine.platform !== filters.platform) {
        return false;
      }

      // Filter by status
      if (filters.status && filters.status !== 'all') {
        const checks = machine.checks;
        const hasIssues = !checks.diskEncryption.encrypted || 
                          !checks.osUpdates.upToDate || 
                          !checks.antivirus.enabled || 
                          !checks.sleepSettings.compliant;
                          
        if (filters.status === 'healthy' && hasIssues) return false;
        if (filters.status === 'issues' && !hasIssues) return false;
      }

      // Filter by search term
      if (filters.search && filters.search.trim() !== '') {
        const searchLower = filters.search.toLowerCase();
        return (
          machine.hostname.toLowerCase().includes(searchLower) ||
          machine.model.toLowerCase().includes(searchLower) ||
          machine.machineId.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  };

  useEffect(() => {
    fetchMachines();
    
    // Set up polling every 60 seconds
    const interval = setInterval(fetchMachines, 60000);
    
    return () => clearInterval(interval);
  }, [apiUrl]);

  return (
    <MachinesContext.Provider value={{ machines, loading, error, fetchMachines, filterMachines }}>
      {children}
    </MachinesContext.Provider>
  );
};