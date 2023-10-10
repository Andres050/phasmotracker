const fuzzy = require('fuzzy');

class Ghost {
    constructor() {
        this.type = "Ghost";

        this.ghosts = [
            'Spirit',
            'Wraith',
            'Phantom',
            'Poltergeist',
            'Banshee',
            'Jinn',
            'Mare',
            'Revenant',
            'Shade',
            'Demon',
            'Yurei',
            'Oni',
            'Yokai',
            'Hantu',
            'Goryo',
            'Myling',
            'Onryo',
            'The Twins',
            'Raiju',
            'Obake',
            'The Mimic',
            'Moroi',
            'Deogen',
            'Thaye',
        ];
    }

    val(text) {
        if (text.length === 0)
            return "";

        let mostSimilarOption = null;
        let highestSimilarity = 0;

        this.ghosts.forEach(option => {
            const similarity = this.similarity(text, option);
            if (similarity > highestSimilarity) {
                highestSimilarity = similarity;
                mostSimilarOption = option;
            }
        });

        return mostSimilarOption;
    }

    similarity(str1, str2) {
        const set1 = new Set(str1);
        const set2 = new Set(str2);

        const intersection = new Set([...set1].filter(x => set2.has(x)));
        const union = new Set([...set1, ...set2]);

        return intersection.size / union.size;
    }

    toArray() {
        return this.ghosts;
    }
}

module.exports = Ghost;