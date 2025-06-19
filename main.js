const { app, BrowserWindow, ipcMain, shell, Menu, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    fullscreen: false,
    frame: true,
    icon: path.join(__dirname, 'assets/favicon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  mainWindow.maximize();
  Menu.setApplicationMenu(null);


const appURL = `file://${path.resolve(__dirname, 'dist', 'nextech-frontend-main', 'browser', 'index.html')}`;

  mainWindow.loadURL(appURL);

  // Abre links externos no navegador padrão
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Abre DevTools em modo de desenvolvimento
  if (!app.isPackaged) {
  }

  // Verifica atualizações apenas no modo empacotado
  if (app.isPackaged) {
    autoUpdater.checkForUpdates();
  }
}

app.on('ready', () => {
  createWindow();

  autoUpdater.on('checking-for-update', () => {
    dialog.showMessageBox({ type: 'info', title: 'Atualização', message: 'Verificando atualizações...' });
  });

  autoUpdater.on('update-available', () => {
    dialog.showMessageBox({ type: 'info', title: 'Atualização disponível', message: 'Baixando nova versão...' });
  });

  autoUpdater.on('update-not-available', () => {
    dialog.showMessageBox({ type: 'info', title: 'Sem atualizações', message: 'Você já está usando a versão mais recente.' });
  });

  autoUpdater.on('error', (err) => {
    dialog.showErrorBox('Erro na atualização', err == null ? 'Erro desconhecido' : (err.stack || err).toString());
  });

  autoUpdater.on('download-progress', (progress) => {
    const msg = `Progresso: ${Math.floor(progress.percent)}% (${Math.round(progress.transferred / 1024 / 1024)}MB de ${Math.round(progress.total / 1024 / 1024)}MB)`;
    console.log(msg);
    mainWindow.webContents.send('update_download_progress', msg);
  });

  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      type: 'info',
      title: 'Atualização pronta',
      message: 'A nova versão foi baixada. O aplicativo será reiniciado para aplicar a atualização.',
      buttons: ['OK']
    }).then(() => autoUpdater.quitAndInstall());
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
