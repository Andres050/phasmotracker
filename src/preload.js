const { contextBridge, ipcRenderer} = require("electron");
const Ghost = require("./js/class/ghost");

contextBridge.exposeInMainWorld('screenshot', {
    getGhosts: () => {
        return new Ghost().toArray()
    },
    captureScreenShot: () => ipcRenderer.send('capture-screenshot'),
    screenShotCaptured: (callback) => {
        ipcRenderer.on('screenshot-capture', (event, args) => callback(event, args));
    },
    nextScreenShot: (data) => ipcRenderer.send('next-screenshot', data),
});