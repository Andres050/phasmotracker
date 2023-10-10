const { app, ipcMain, screen, desktopCapturer} = require("electron");
const { appendFileSync } = require("fs");
const Reader = require('./ocr_reader.js');
const Resolution = require('./class/resolution.js');
const Notifications = require("./notifications");
const path = require("path");

class Capture {
    constructor() {
        ipcMain.on('capture-screenshot', async (event) => {
            const screenShotInfo = await captureScreen();
            const dataURL = screenShotInfo.thumbnail.toDataURL();
            const resolution = screenShotInfo.resolution;
            const data = await new Reader(dataURL, resolution).read();

            console.log(data);
            event.sender.send('screenshot-capture', {
                dataURL: dataURL,
                data: data,
                resolution: resolution
            });
        });

        ipcMain.on('next-screenshot', async (event, ...data) => {
            try {
                appendFileSync(path.join(__dirname, '../data/phasmophobia.csv'), await setDataCSV(data[0]));

                const Notification = new Notifications();
                Notification.captured.show();
            } catch (err) {
                console.error(err);
            }
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

            return {
                thumbnail: primarySource.thumbnail,
                resolution: new Resolution(width, height)
            };
        }

        async function setDataCSV(args) {
            let csv = "";
            for (let i = 0; i < args.length; i++) {
                let capture = args[i];
                csv += capture.text+',';
            }

            return csv.slice(0, -1)+"\n";
        }
    }
}

module.exports = Capture;