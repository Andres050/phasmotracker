const { ipcMain} = require("electron");
const Capture = require('../js/capture.js');
const Settings = require('../js/settings.js');
const Colors = require('../js/colors.js');

class SettingsIpcMain {
    constructor() {
        this.settings = new Settings();
        this.colors = new Colors();
        this.capture = new Capture();

        ipcMain.on('get-settings', async (event) => {
            const screenShotInfo = await this.capture.captureScreen();
            const dataURL = screenShotInfo.thumbnail.toDataURL();
            const data = await this.settings.read();
            const colors = await this.colors.read();

            event.sender.send('get-settings-read', {
                data: data,
                dataURL: dataURL,
                colors: colors
            });
        });

        ipcMain.on('set-settings-coordinates', async (event, args) => {
            try {
                let json = await this.settings.read();

                json.find((o, i) => {
                    if (o.name === args.name) {
                        json[i].rectangle = { left: parseInt(args.left), top: parseInt(args.top), width: parseInt(args.width), height: parseInt(args.height) };
                        return true; // stop searching
                    }
                });

                await this.settings.write(json);
            } catch (err) {
                console.error(err);
            }
        });

        ipcMain.on('set-settings-order', async (event, ...args) => {
            try {
                let json = await this.settings.read();
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

                await this.settings.write(json);
            } catch (err) {
                console.error(err);
            }
        });
    }
}

module.exports = SettingsIpcMain;