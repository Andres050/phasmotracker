const fuzzy = require('fuzzy');

class Ghost {
    constructor() {
        this.ghosts = [
            'Banshee',
            'Demon',
            'Deogen',
            'Goryo',
            'Hantu',
            'Jinn',
            'Mare',
            'Moroi',
            'Myling',
            'Obake',
            'Oni',
            'Onryo',
            'Phantom',
            'Poltergeist',
            'Raiju',
            'Revenant',
            'Shade',
            'Spirit',
            'Thaye',
            'The Mimic',
            'The Twins',
            'Wraith',
            'Yokai',
            'Yurei',
        ];
    }

    val(text) {
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
}

module.exports = Ghost;