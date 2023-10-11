const fs = require("fs");
const Notifications = require("./class/notifications");
const Capture = require("./class/capture");
const Rectangle = require("./class/rectangle");
const Float = require("./class/float");
const Ghost = require("./class/ghost");
const Range = require("./class/range");
const Colors = require("./class/colors");
const path = "src/settings.json";

class Settings {
    async read() {
        let res = fs.existsSync(path);
        if (res) {
            let dt = fs.readFileSync(path);
            return JSON.parse(dt);
        } else {
            return await this.regenerateSettings();
        }
    }

    async write(data) {
        let sData = JSON.stringify(data);
        fs.writeFileSync(path, sData);
        const Notification = new Notifications();
        Notification.settings.show();
    }

    async regenerateSettings() {
        let settingsDefault = [
            new Capture("Correct", new Rectangle(1450, 450, 180, 100), "number", 3, new Range(0, 100)),
            new Capture("Investigation Bonus", new Rectangle( 1450, 750, 200, 100), "number", 7, new Range(0, 190)),
            new Capture("Mission 1", new Rectangle( 1450, 550, 180, 100), "number", 4, new Range(25, 30)),
            new Capture("Mission 2", new Rectangle( 1450, 600, 180, 100), "number", 5, new Range(25, 30)),
            new Capture("Mission 3", new Rectangle( 1450, 690, 180, 100), "number", 6, new Range(25, 30)),

            new Capture("Level", new Rectangle( 1810, 750, 100, 70), "number", 8, new Range(0, 1000)),
            new Capture("Xp", new Rectangle( 1700, 880, 300, 200), "number", 9, new Range(0, 10000)),
            new Capture("Rewards", new Rectangle( 1450, 800, 200, 100), "float", 10, new Float()),
            new Capture("Ghost Type", new Rectangle(1300, 1200, 350, 200), "text", 1, new Ghost()),
        ];

        await this.write(settingsDefault);

        return await this.read();
    }

    async regenerateColors() {
        let colorsDefault = new Colors();

        await this.write(colorsDefault);

        return await this.read();
    }
}

module.exports = Settings;