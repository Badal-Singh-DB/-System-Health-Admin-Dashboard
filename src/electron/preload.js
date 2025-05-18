import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getMachineId: () => ipcRenderer.invoke('get-machine-id'),
  getLastReportTime: () => ipcRenderer.invoke('get-last-report-time'),
  runHealthCheck: () => ipcRenderer.invoke('run-health-check'),
  onHealthUpdated: (callback) => {
    ipcRenderer.on('health-updated', (_, data) => callback(data));
    return () => {
      ipcRenderer.removeAllListeners('health-updated');
    };
  }
});