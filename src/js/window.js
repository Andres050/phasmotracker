const { BrowserWindow } = require('electron');
const path = require("path");

class Window {
    constructor(width, height, dev = false) {
        this.mainWindow = new BrowserWindow({
            width: width,
            height: height,
            webPreferences: {
                preload: path.join(__dirname, '../preload.js'),
                nodeIntegration: true,
                contextIsolation: true,
                enableRemoteModule: true,
            },
            icon: path.join(__dirname, '../assets/favicon.png'),
        });

        if (dev) {
            this.mainWindow.webContents.openDevTools();
        }
        this.mainWindow.loadFile('./src/pages/index.html');

        this.mainWindow.on('closed', () => {
            this.mainWindow = null;
        });
    }
}

module.exports = Window;