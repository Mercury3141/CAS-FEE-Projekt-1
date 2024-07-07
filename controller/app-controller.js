const Database = require('../services/database');

class AppController {
    constructor() {
        this.database = new Database();
    }

    createGroup(group) {
        return this.database.saveGroup(group);
    }

    getGroups() {
        return this.database.getGroups();
    }
}

module.exports = AppController;
