const { ipcMain } = require("electron");
const { appendFileSync } = require("fs");
const path = require("path");

const Reader = require('../js/ocr_reader.js');
const Notifications = require("../js/class/notifications");
const Capture = require('../js/capture.js');
const Colors = require("../js/colors");

class CaptureIpcMain {
    constructor() {
        this.capture = new Capture();
        this.colors = new Colors();

        ipcMain.on('capture-screenshot', async (event) => {
            const screenShotInfo = await this.capture.captureScreen();
            const dataURL = screenShotInfo.thumbnail.toDataURL();
            const resolution = screenShotInfo.resolution;
            const data = await new Reader(dataURL, resolution).read();
            const colors = await this.colors.read();

            event.sender.send('screenshot-capture', {
                dataURL: dataURL,
                data: data,
                resolution: resolution,
                colors: colors
            });
        });

        ipcMain.on('next-screenshot', async (event, ...data) => {
            try {
                appendFileSync(path.join(__dirname, '../data/phasmophobia.csv'), await this.capture.setDataCSV(data[0]));

                const Notification = new Notifications();
                Notification.captured.show();
            } catch (err) {
                console.error(err);
            }
        });
    }
}

module.exports = CaptureIpcMain;