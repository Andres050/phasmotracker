const { BrowserWindow } = require('electron');
const path = require("path");

class Window {
    constructor() {
        this.mainWindow = new BrowserWindow({
            width: 1920,
            height: 1080,
            webPreferences: {
                preload: path.join(__dirname, '../preload.js'),
                nodeIntegration: true,
                contextIsolation: true,
                enableRemoteModule: true,
            },
            icon: path.join(__dirname, '../images/favicon.png'),
        });
        this.mainWindow.loadFile('./src/index.html');
    }
}

module.exports = Window;