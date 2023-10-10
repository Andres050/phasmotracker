class Capture {
    constructor(name, rectangle, type, order, filter = null) {
        this.name = name;
        this.rectangle = rectangle;
        this.type = type;
        this.order = order;
        this.filter = filter;
    }
}

module.exports = Capture;