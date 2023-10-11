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

contextBridge.exposeInMainWorld('settings', {
    getSettings: () => ipcRenderer.send('get-settings'),
    getSettingsRead: (callback) => {
        ipcRenderer.on('get-settings-read', (event, args) => callback(event, args));
    },
    setSettingsCoordinates: (data) => ipcRenderer.send('set-settings-coordinates', data),
    setSettingsOrder: (data) => ipcRenderer.send('set-settings-order', data),
});

contextBridge.exposeInMainWorld('colors', {
    getColors: () => ipcRenderer.send('get-colors'),
    getColorsResponse: (callback) => {
        ipcRenderer.on('get-colors-response', (event, args) => callback(event, args));
    },
    setColors: (data) => ipcRenderer.send('set-colors', data),
});
