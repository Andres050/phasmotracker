const { contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld('screenshot', {
    captureScreenShot: () => ipcRenderer.send('capture-screenshot'),
    screenShotCaptured: (callback) => {
        ipcRenderer.on('screenshot-capture', (event, args) => callback(event, args));
    },
});