const Range = require("./range.js");

class Rectangle {
    constructor(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
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