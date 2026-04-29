// Preload script runs in a separate context
// It can expose specific APIs to the renderer process

const { contextBridge, ipcRenderer } = require('electron');

// Expose database API to renderer
contextBridge.exposeInMainWorld('db', {
  getAllBoards: () => ipcRenderer.invoke('db:getAllBoards'),
  createBoard: (id, title) => ipcRenderer.invoke('db:createBoard', id, title),
  deleteBoard: (id) => ipcRenderer.invoke('db:deleteBoard', id),
  createTask: (id, boardId, title, priority, status, description) => 
    ipcRenderer.invoke('db:createTask', id, boardId, title, priority, status, description),
  deleteTask: (id) => ipcRenderer.invoke('db:deleteTask', id)
});

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});
