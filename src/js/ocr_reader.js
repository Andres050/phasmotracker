const { createWorker } = require("tesseract.js");
const Settings = require("./settings.js");
const Float = require("./class/float");
const Ghost = require("./class/ghost");
const Range = require("./class/range");

class Reader {
    constructor(dataURL, resolution) {
        this.dataURL = dataURL;
        this.resolution = resolution;
    }

    async read() {
        const settings = new Settings().read();

        let types = this.groupBy(settings, "type");

        const texts = await this.rectangles(types.text);
        const numbers = await this.rectangles(types.number, '0123456789');
        const floats = await this.rectangles(types.float, '.,0123456789');

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
                rectangle: rectangleItem
            });

            //console.log(capture);
            const item = {
                name: capture.name,
                text: this.setTypeText(capture.filter, text.replaceAll('\n', '')),
                coordinates: rectangleItem,
                order: capture.order
            };

            values.push(item);
        }

        await worker.terminate();
        return values;
    };

    setTypeText(filter, text) {
        switch (filter.type) {
            case "Range":
                return new Range(filter.min, filter.max).val(text);
            case "Float":
                return new Float().val(text);
            case "Ghost":
                return new Ghost().val(text);
            default:
                return text;
        }
    }

    groupBy(arr, property) {
        return arr.reduce(function(memo, x) {
            if (!memo[x[property]]) { memo[x[property]] = []; }
            memo[x[property]].push(x);
            return memo;
        }, {});
    }
}

module.exports = Reader;