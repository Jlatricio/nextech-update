const { app, BrowserWindow, ipcMain, shell, Menu, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    fullscreen: true,
    icon: path.join(__dirname, 'assets/favicon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  // Remove o menu padrão
  Menu.setApplicationMenu(null);

  const appURL = app.isPackaged
    ? `file://${__dirname}/dist/browser/index.html`
    : 'http://localhost:4200';

  mainWindow.loadURL(appURL);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Verifica atualizações se estiver empacotado
  if (app.isPackaged) {
    autoUpdater.checkForUpdates();
  }
}

app.on('ready', () => {
  createWindow();

  autoUpdater.on('checking-for-update', () => {
    dialog.showMessageBox({
      type: 'info',
      title: 'Atualização',
      message: 'Verificando atualizações...',
    });
  });

  autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
      type: 'info',
      title: 'Atualização disponível',
      message: 'Uma nova versão está disponível. Baixando agora...',
    });
  });

  autoUpdater.on('update-not-available', () => {
    dialog.showMessageBox({
      type: 'info',
      title: 'Sem atualizações',
      message: 'Você já está usando a versão mais recente.',
    });
  });

  autoUpdater.on('error', (err) => {
    dialog.showErrorBox('Erro na atualização', err == null ? 'Erro desconhecido' : (err.stack || err).toString());
  });

  autoUpdater.on('download-progress', (progressObj) => {
    let msg = `Progresso: ${Math.floor(progressObj.percent)}% (${Math.round(progressObj.transferred / 1024 / 1024)}MB de ${Math.round(progressObj.total / 1024 / 1024)}MB)`;
    console.log(msg);
    mainWindow.webContents.send('update_download_progress', msg);
  });

  autoUpdater.on('update-downloaded', () => {
    dialog
      .showMessageBox({
        type: 'info',
        title: 'Atualização pronta',
        message: 'A nova versão foi baixada. O aplicativo será reiniciado para aplicar a atualização.',
        buttons: ['OK']
      })
      .then(() => {
        autoUpdater.quitAndInstall();
      });
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
