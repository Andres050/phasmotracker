class Resolution {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    toArray() {
        return {
            width: this.width,
            height: this.height,
        };
    }
}

module.exports = Resolution;