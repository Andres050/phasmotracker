const { app, BrowserWindow} = require('electron');
const Window = require('./js/window.js');
const Notifications = require('./js/class/notifications.js');
const CaptureIpcMain = require('./event/capture.js');
const SettingsIpcMain = require('./event/settings.js');
const ColorsIpcMain = require('./event/colors.js');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(() => {const win = new Window(2400, 600, true);}).then(function () {
  const Notification = new Notifications();
  Notification.welcome.show();
});

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
    const win = new Window();
  }
});

// Init Triggers And Classes
new CaptureIpcMain();
new SettingsIpcMain();
new ColorsIpcMain();