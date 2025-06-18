const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateProgress: (callback) => ipcRenderer.on('update_download_progress', (event, message) => callback(message))
});
