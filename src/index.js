const { app, BrowserWindow} = require('electron');
const Window = require('./js/window.js');
const Notifications = require('./js/notifications.js');
const Capture = require('./js/capture.js');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(() => {const win = new Window();}).then(function () {
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
new Capture();
