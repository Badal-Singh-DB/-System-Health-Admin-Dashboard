import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import MachineDetail from './pages/MachineDetail';
import Settings from './pages/Settings';
import { ApiProvider } from './context/ApiContext';
import { MachinesProvider } from './context/MachinesContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <ApiProvider>
        <MachinesProvider>
          <Router>
            <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
              <Sidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/machine/:id" element={<MachineDetail />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </main>
              </div>
            </div>
          </Router>
        </MachinesProvider>
      </ApiProvider>
    </ThemeProvider>
  );
}

export default App;