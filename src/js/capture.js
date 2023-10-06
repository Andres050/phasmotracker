const {ipcMain, screen, desktopCapturer} = require("electron");
const Reader = require('./ocr_reader.js');
const Resolution = require('./class/resolution.js');

class Capture {
    constructor() {
        ipcMain.on('capture-screenshot', async (event) => {
            const screenShotInfo = await captureScreen();
            const dataURL = screenShotInfo.thumbnail.toDataURL();
            const resolution = screenShotInfo.resolution;
            const data = await new Reader(dataURL, resolution).read();

            event.sender.send('screenshot-capture', {
                dataURL: dataURL,
                data: data,
                resolution: resolution
            });
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
    }
}

module.exports = Capture;