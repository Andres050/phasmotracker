const Rectangle = require('./class/rectangle.js');
const Range = require("./class/range.js");
const Capture = require("./class/capture.js");
const Ghost = require("./class/ghost.js");
const Float = require("./class/float.js");
const { createWorker } = require("tesseract.js");

class Reader {
    constructor(dataURL, resolution) {
        this.dataURL = dataURL;
        this.resolution = resolution;

        /** REMINDER, ONLY THE MONEY COURSE THE TEXT THERE IS MORE PROBLEMS */
        this.numbers = [
            /** MISSIONS */
            new Capture("Correct", new Rectangle(1450, 450, 180, 100), new Range(0, 100)),
            new Capture("Investigation Bonus", new Rectangle( 1450, 750, 200, 100), new Range(0, 190)),

            new Capture("Mission 1", new Rectangle( 1450, 550, 180, 100), new Range(25, 30)),
            new Capture("Mission 2", new Rectangle( 1450, 600, 180, 100), new Range(25, 30)),
            new Capture("Mission 3", new Rectangle( 1450, 690, 180, 100), new Range(25, 30)),

            /** LEVEL && XP */
            new Capture("Level", new Rectangle( 1810, 750, 100, 70), new Range(0, 1000)),
            new Capture("Xp", new Rectangle( 1700, 880, 300, 200), new Range(0, 10000)),
        ];

        this.floats = [
            new Capture("Rewards", new Rectangle( 1450, 800, 200, 100), new Float()),
        ];

        this.texts = [
            new Capture("Ghost Type", new Rectangle(1300, 1200, 350, 200), new Ghost()),
        ]
    }

    async read() {
        const texts = await this.rectangles(this.texts);
        const numbers = await this.rectangles(this.numbers, '0123456789');
        const floats = await this.rectangles(this.floats, '.,0123456789');

        return [...texts, ...numbers, ...floats];
    }

    async rectangles(captures, tessedit_char_whitelist = null) {
        const worker = await createWorker('eng');
        if (tessedit_char_whitelist) {
            await worker.setParameters({
                tessedit_char_whitelist: tessedit_char_whitelist,
            });
        }

        const values = [];
        for (let i = 0; i < captures.length; i++) {
            const capture = captures[i];
            const rectangleItem = capture.rectangle;

            const { data: { text } } = await worker.recognize(this.dataURL, {
                rectangle: rectangleItem.toArray()
            });

            const item = {
                name: capture.name,
                text: capture.filter.val(text.replaceAll('\n', '')),
                coordinates: rectangleItem.toArray()
            };

            values.push(item);
        }

        await worker.terminate();
        return values;
    };
}

module.exports = Reader;