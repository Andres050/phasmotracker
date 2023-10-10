const {ipcMain, screen, desktopCapturer} = require("electron");
const fs = require("fs");
const Notifications = require("./notifications");
const Capture = require("./class/capture");
const Rectangle = require("./class/rectangle");
const Float = require("./class/float");
const Ghost = require("./class/ghost");
const Range = require("./class/range");
const Resolution = require("./class/resolution");

class Settings {
    constructor() {
        ipcMain.on('get-settings', async (event) => {
            const screenShotInfo = await captureScreen();
            const dataURL = screenShotInfo.thumbnail.toDataURL();
            const data = await read();

            event.sender.send('get-settings-read', {
                data: data,
                dataURL: dataURL
            });
        });

        ipcMain.on('set-settings-coordinates', async (event, args) => {
            try {
                let json = await read();

                json.find((o, i) => {
                    if (o.name === args.name) {
                        json[i].rectangle = { left: parseInt(args.left), top: parseInt(args.top), width: parseInt(args.width), height: parseInt(args.height) };
                        return true; // stop searching
                    }
                });

                await write(json);
            } catch (err) {
                console.error(err);
            }
        });

        ipcMain.on('set-settings-order', async (event, ...args) => {
            try {
                let json = await read();
                let capturesOrders = args[0];

                for (let i = 0; i < capturesOrders.length; i++) {
                    let capturesOrder = capturesOrders[i];

                    json.find((o, i) => {
                        if (o.name === capturesOrder.name) {
                            json[i].order = parseInt(capturesOrder.order);
                            return true; // stop searching
                        }
                    });
                }

                await write(json);
            } catch (err) {
                console.error(err);
            }
        });

        async function read() {
            let res = fs.existsSync("src/settings.json");
            if (res) {
                let dt = fs.readFileSync("src/settings.json");
                return JSON.parse(dt);
            } else {
                return await regenerateSettings();
            }
        }

        async function write(data) {
            let sData = JSON.stringify(data);
            fs.writeFileSync("src/settings.json", sData);
            const Notification = new Notifications();
            Notification.settings.show();
        }

        async function regenerateSettings() {
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

            await write(settingsDefault);

            return await read();
        }

        async function captureScreen() {
            const primaryDisplay = screen.getPrimaryDisplay();
            const { width, height } = primaryDisplay.size;

            const options = {
                types: ['screen'],
                thumbnailSize: { width, height}
            };

            const sources = await desktopCapturer.getSources(options);
            const primarySource = sources.find(({display_id}) => display_id == primaryDisplay.id);

            return {
                thumbnail: primarySource.thumbnail,
                resolution: new Resolution(width, height)
            };
        }
    }

    read() {
        let res = fs.existsSync("src/settings.json");
        if (res) {
            let dt = fs.readFileSync("src/settings.json");
            return JSON.parse(dt);
        }
    }
}

module.exports = Settings;