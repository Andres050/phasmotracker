class Float {
    constructor() {
        this.type = "Float";
    }

    val(text) {
        return parseFloat(text);
    }
}

module.exports = Float;