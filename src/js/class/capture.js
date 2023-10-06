class Capture {
    constructor(name, rectangle, filter = null) {
        this.name = name;
        this.rectangle = rectangle;
        this.filter = filter;
    }
}

module.exports = Capture;