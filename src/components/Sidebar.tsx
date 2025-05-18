import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Monitor, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Menu, 
  X,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useMachines } from '../context/MachinesContext';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const { machines } = useMachines();
  
  // Calculate issues count
  const issuesCount = machines.filter(machine => {
    const checks = machine.checks;
    return !checks.diskEncryption.encrypted || 
           !checks.osUpdates.upToDate || 
           !checks.antivirus.enabled || 
           !checks.sleepSettings.compliant;
  }).length;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center px-4 py-3 ${
      isActive 
        ? 'text-white bg-blue-600 rounded-lg' 
        : 'text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white'
    } transition-colors duration-200`;

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="fixed z-20 bottom-4 right-4 p-3 rounded-full bg-blue-600 text-white md:hidden shadow-lg"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-10 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:h-screen`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 border-b dark:border-gray-700">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">System Monitor</h1>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            <NavLink to="/" className={navLinkClass} onClick={closeSidebar}>
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard
            </NavLink>

            <div className="pt-4 pb-2">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  {issuesCount > 0 ? (
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    System Status
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {issuesCount > 0 ? `${issuesCount} issues found` : 'All systems normal'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-1 px-3 pt-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Machines
              </p>
            </div>
          
            <div className="max-h-40 overflow-y-auto">
              {machines.slice(0, 5).map(machine => (
                <NavLink 
                  key={machine.machineId}
                  to={`/machine/${machine.machineId}`} 
                  className={navLinkClass}
                  onClick={closeSidebar}
                >
                  <Monitor className="mr-3 h-5 w-5" />
                  <span className="truncate">{machine.hostname}</span>
                </NavLink>
              ))}
              {machines.length > 5 && (
                <NavLink 
                  to="/" 
                  className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                  onClick={closeSidebar}
                >
                  <span className="ml-8 text-xs italic">+ {machines.length - 5} more</span>
                </NavLink>
              )}
            </div>

            <div className="pt-4">
              <NavLink to="/settings" className={navLinkClass} onClick={closeSidebar}>
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </NavLink>
            </div>
          </nav>
          
          <div className="p-4 border-t dark:border-gray-700">
            <button
              onClick={toggleDarkMode}
              className="flex items-center justify-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? (
                <>
                  <Sun className="mr-2 h-4 w-4" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-4 w-4" />
                  Dark Mode
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;