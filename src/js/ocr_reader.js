const Rectangle = require('./class/rectangle.js');
const Range = require("./class/range.js");
const { createWorker } = require("tesseract.js");

class Reader {
    constructor(dataURL, resolution) {
        this.dataURL = dataURL;
        this.resolution = resolution;

        /** REMINDER, ONLY THE MONEY COURSE THE TEXT THERE IS MORE PROBLEMS */
        this.numbers = [
            /** MISSIONS */
            new Rectangle("Correct", 1450, 450, 180, 100, new Range(0, 100)),
            new Rectangle("Mission1", 1450, 550, 180, 100, new Range(25, 30)),
            new Rectangle("Mission2", 1450, 600, 180, 100, new Range(25, 30)),
            new Rectangle("Mission3", 1450, 690, 180, 100, new Range(25, 30)),

            new Rectangle("Investigation Bonus", 1450, 750, 200, 100, new Range(0, 190)),
            new Rectangle("Rewards", 1450, 800, 200, 100, new Range(0, 2400)),

            /** LEVEL && XP */
            new Rectangle("level", 1810, 750, 100, 70, new Range(0, 1000)),
            new Rectangle("xp", 1700, 880, 300, 200, new Range(0, 10000)),
        ];

        this.texts = [
            new Rectangle("Ghost Type", 1300, 1200, 350, 200),
        ]
    }

    async read() {
        const texts = await this.text();
        const numbers = await this.number();

        return [...texts, ...numbers];
    }

    async number() {
        const worker = await createWorker('eng');
        await worker.setParameters({
            tessedit_char_whitelist: '0123456789',
        });

        const rectangles = this.numbers;
        const values = [];
        for (let i = 0; i < rectangles.length; i++) {
            const rectangleItem = rectangles[i];
            const { data: { text } } = await worker.recognize(this.dataURL, {
                rectangle: rectangleItem.toArray()
            });

            const item = {
                name: rectangleItem.name,
                text: rectangleItem.range.val(parseFloat(text.replaceAll('\n', ''))),
                coordinates: rectangleItem.toArray()
            };

            console.log(item);
            values.push(item);
        }

        await worker.terminate();
        return values;
    }

    async text() {
        const worker = await createWorker('eng');
        const rectangles = this.texts;

        const values = [];
        for (let i = 0; i < rectangles.length; i++) {
            const rectangleItem = rectangles[i];
            const { data: { text } } = await worker.recognize(this.dataURL, {
                rectangle: rectangleItem.toArray()
            });

            const item = {
                name: rectangleItem.name,
                text: text.replaceAll('\n', ''),
                coordinates: rectangleItem.toArray()
            };

            console.log(item);
            values.push(item);
        }

        await worker.terminate();
        return values;
    }
}

module.exports = Reader;