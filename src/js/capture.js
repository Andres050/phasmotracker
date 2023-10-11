const { screen, desktopCapturer} = require("electron");
const Resolution = require('./class/resolution.js');

class Capture {
    async captureScreen() {
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

    async setDataCSV(args) {
        let csv = "";
        for (let i = 0; i < args.length; i++) {
            let capture = args[i];
            csv += capture.text+',';
        }

        return csv.slice(0, -1)+"\n";
    }
}

module.exports = Capture;