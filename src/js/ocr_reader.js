const Rectangle = require('./rectangle.js');
const { createWorker, PSM } = require("tesseract.js");

class Reader {
    constructor(dataURL) {
        this.dataURL = dataURL;
        this.rectangles = [
            /** HEADER */
            new Rectangle("header", 316, 155, 700, 250),

            /** TABS */
            new Rectangle("tab", 316, 255, 550, 200),
            new Rectangle("tab", 1110, 255, 400, 200),
            new Rectangle("tab", 1580, 255, 550, 200),

            /** MISSIONS PAPER !Todo */
            new Rectangle("correct", 380, 450, 1250, 80),
            new Rectangle("mission1", 380, 500, 1250, 80),
            new Rectangle("mission2", 380, 550, 1250, 80),
            new Rectangle("mission3", 380, 600, 1250, 80),

            //new Rectangle("ghost", 1580, 255, 550, 200),

            /** LEVEL && XP !Todo */
            //new Rectangle("level", 1580, 255, 550, 200),
            //new Rectangle("xp", 1580, 255, 550, 200),

        ];
    }

    async read() {
        const worker = await createWorker('eng');

        const rectangles = this.rectangles;
        const values = [];
        for (let i = 0; i < rectangles.length; i++) {
            const rectangleItem = rectangles[i];

            const { data: { text } } = await worker.recognize(this.dataURL, { rectangle: rectangleItem.toArray() });
            values.push({
                name: rectangleItem.name,
                text: text
            });
        }


        await worker.terminate();
        return values;
    }
}

module.exports = Reader;