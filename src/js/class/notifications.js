const {Notification} = require("electron");

class Notifications {
    constructor() {
        this.welcome = new Notification({ title: 'PhasmoTracker', body: 'Welcome to PhasmoTracker v1.0 \n by AndresAndMomo' });
        this.captured = new Notification({ title: 'Data saved!', body: 'Your data has been saved!' });
        this.settings = new Notification({ title: "Setting Updated", body: ""});
    }
}

module.exports = Notifications;