const { ipcMain} = require("electron");
const Colors = require('../js/colors.js');
const Color = require('../js/class/colors.js');

class ColorsIpcMain {
    constructor() {
        this.colors = new Colors();

        ipcMain.on('get-colors', async (event) => {
            const colors = await this.colors.read();

            event.sender.send('get-colors-response', {
                colors: colors
            });
        });

        ipcMain.on('set-colors', async (event, args) => {
            try {
                let colors = {};

                for (let i = 0; i < args.length; i++) {
                    let attributes = args[i];
                    colors[attributes.name] = attributes.value;
                }

                await this.colors.write(colors);
            } catch (err) {
                console.error(err);
            }
        });
    }
}

module.exports = ColorsIpcMain;