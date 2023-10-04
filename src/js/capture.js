const {ipcMain, screen, desktopCapturer} = require("electron");
const {createWorker} = require("tesseract.js");
const Reader = require('./ocr_reader.js');

class Capture {
    constructor() {
        ipcMain.on('capture-screenshot', async (event) => {
            const screenShotInfo = await captureScreen();
            const dataURL = screenShotInfo.toDataURL();

            const text = await captureText(dataURL);

            event.sender.send('screenshot-capture', {
                dataURL: dataURL,
                text: text
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

            return primarySource.thumbnail;
        }

        async function captureText(dataURL) {
            const worker = await createWorker('eng');
            const { data: { text } } = await worker.recognize(dataURL);
            await worker.terminate();
            return text;
        }
    }
}

module.exports = Capture;