const { app, BrowserWindow, Notification, desktopCapturer, ipcMain, screen} = require('electron');
const path = require('path');
const { shell } = require('electron');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const NOTIFICATION_TITLE = 'PhasmoTracker'
const NOTIFICATION_BODY = 'Welcome to PhasmoTracker v1.0 by AndresAndMomo'

function showNotification () {
  new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  //mainWindow.webContents.on('did-finish-load', () => {
  //  shell.openExternal('steam://rungameid/739630');
  //});
};

app.whenReady().then(createWindow).then(showNotification)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {app.quit();}
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on('capture-screenshot', async (event) => {
  const screenShotInfo = await captureScreen();
  const dataURL = screenShotInfo.toDataURL();

  event.sender.send('screenshot-capture', dataURL);
});

async function captureScreen() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.size;

  const options = {
    types: ['screen'],
    thumbnailSize: { width, height}
  };

  const sources = await desktopCapturer.getSources(options);
  const primarySource = sources.find(({display_id}) => display_id == primaryDisplay.id);

  const image = primarySource.thumbnail;

  return image;
}