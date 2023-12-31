class Range {
    constructor(min = 0, max = 100) {
        this.type = "Range";
        this.min = min;
        this.max = max;
    }

    val(num) {
        return this.isValid(parseInt(num)) ? parseInt(num) : 0;
    }

    isValid(num) {
        return this.min <= num && this.max >= num;
    }
}

module.exports = Range;