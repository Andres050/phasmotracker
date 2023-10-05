const Range = require("./range.js");

class Rectangle {
    constructor(name, left, top, width, height, range = null) {
        this.name = name;
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
        this.range = range;
    }

    toArray() {
        return {
            left: this.left,
            top: this.top,
            width: this.width,
            height: this.height
        };
    }
}

module.exports = Rectangle;