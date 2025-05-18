import { app, BrowserWindow, Tray, Menu, ipcMain } from 'electron';
import Store from 'electron-store';
import path from 'path';
import { fileURLToPath } from 'url';
import { checkSystemHealth } from './systemChecks.js';
import { reportHealthData } from './reporter.js';

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize store
const store = new Store({
  schema: {
    machineId: {
      type: 'string'
    },
    lastReportTime: {
      type: 'number',
      default: 0
    },
    checkInterval: {
      type: 'number',
      default: 30 * 60 * 1000 // 30 minutes in milliseconds
    },
    apiEndpoint: {
      type: 'string',
      default: 'http://localhost:3000/api/report'
    }
  }
});

// Generate machine ID if not exists
if (!store.get('machineId')) {
  const { v4: uuidv4 } = await import('uuid');
  store.set('machineId', uuidv4());
}

let mainWindow = null;
let tray = null;
let checkIntervalId = null;

// Create the main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: path.join(__dirname, '../../public/icon.png')
  });

  // Load the index.html from Vite dev server or built files
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  mainWindow.on('close', (event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create tray icon
function createTray() {
  tray = new Tray(path.join(__dirname, '../../public/icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open', click: () => { if (mainWindow) mainWindow.show(); else createWindow(); } },
    { label: 'Check Now', click: runHealthCheck },
    { type: 'separator' },
    { label: 'Quit', click: () => { app.isQuitting = true; app.quit(); } }
  ]);
  tray.setToolTip('System Health Monitor');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
      }
    } else {
      createWindow();
    }
  });
}

// Run health check and report if changes
async function runHealthCheck() {
  try {
    const healthData = await checkSystemHealth(store.get('machineId'));
    const lastData = store.get('lastHealthData');
    
    // Report if it's first run or if data has changed
    if (!lastData || JSON.stringify(lastData) !== JSON.stringify(healthData)) {
      await reportHealthData(healthData, store.get('apiEndpoint'));
      store.set('lastHealthData', healthData);
      store.set('lastReportTime', Date.now());
      
      // Notify renderer process if window exists
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('health-updated', healthData);
      }
    }
  } catch (error) {
    console.error('Health check failed:', error);
  }
}

// Start periodic health checks
function startPeriodicChecks() {
  // Clear any existing intervals
  if (checkIntervalId) {
    clearInterval(checkIntervalId);
  }

  // Run once at startup
  runHealthCheck();

  // Then set up interval
  const interval = store.get('checkInterval');
  checkIntervalId = setInterval(runHealthCheck, interval);
}

// IPC handlers
ipcMain.handle('get-machine-id', () => {
  return store.get('machineId');
});

ipcMain.handle('get-last-report-time', () => {
  return store.get('lastReportTime');
});

ipcMain.handle('run-health-check', async () => {
  await runHealthCheck();
  return store.get('lastHealthData');
});

// App event handlers
app.on('ready', () => {
  createTray();
  createWindow();
  startPeriodicChecks();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  app.isQuitting = true;
  if (checkIntervalId) {
    clearInterval(checkIntervalId);
  }
});