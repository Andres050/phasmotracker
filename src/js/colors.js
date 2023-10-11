const fs = require("fs");
const Notifications = require("./class/notifications");
const Color = require("./class/colors");
const path = "src/colors.json";

class Colors {
    async read() {
        let res = fs.existsSync(path);
        if (res) {
            let dt = fs.readFileSync(path);
            return JSON.parse(dt);
        } else {
            return await this.regenerateColors();
        }
    }

    async write(data) {
        let sData = JSON.stringify(data);
        fs.writeFileSync(path, sData);
        const Notification = new Notifications();
        Notification.settings.show();
    }

    async regenerateColors() {
        let colorsDefault = new Color();

        await this.write(colorsDefault);

        return await this.read();
    }
}

module.exports = Colors;