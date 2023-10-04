const {Notification} = require("electron");

class Notifications {
    constructor() {
        this.welcome = new Notification({ title: 'PhasmoTracker', body: 'Welcome to PhasmoTracker v1.0 by AndresAndMomo' });
    }
}

module.exports = Notifications;