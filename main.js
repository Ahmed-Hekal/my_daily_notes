const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./database');

function createWindow() {
  // Create the browser window
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load the index.html file
  mainWindow.loadFile('index.html');

  // Open DevTools (optional - remove in production)
  // mainWindow.webContents.openDevTools();
}

// IPC Handlers for database operations
ipcMain.handle('db:getAllBoards', () => {
  return db.getAllBoards();
});

ipcMain.handle('db:createBoard', (event, id, title) => {
  return db.createBoard(id, title);
});

ipcMain.handle('db:deleteBoard', (event, id) => {
  db.deleteBoard(id);
  return true;
});

ipcMain.handle('db:createTask', (event, id, boardId, title, priority, status, description) => {
  return db.createTask(id, boardId, title, priority, status, description);
});

ipcMain.handle('db:deleteTask', (event, id) => {
  db.deleteTask(id);
  return true;
});

ipcMain.handle('db:updateTaskPositions', (event, taskPositions) => {
  db.updateTaskPositions(taskPositions);
  return true;
});

ipcMain.handle('db:updateTaskDescription', (event, taskId, description) => {
  db.updateTaskDescription(taskId, description);
  return true;
});

// This method will be called when Electron has finished initialization
app.whenReady().then(async () => {
  // Initialize database
  await db.initDatabase();
  
  createWindow();

  app.on('activate', () => {
    // On macOS, re-create a window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On macOS, apps stay active until user quits explicitly
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
