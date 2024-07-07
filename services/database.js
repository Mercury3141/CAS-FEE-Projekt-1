const fs = require('fs');
const path = require('path');

class Database {
    constructor() {
        this.filePath = path.join(__dirname, 'groups.json');
        this.groups = this.loadGroups();
    }

    loadGroups() {
        try {
            if (fs.existsSync(this.filePath)) {
                const data = fs.readFileSync(this.filePath, 'utf8');
                console.log('Groups loaded:', data); // Logging the loaded data
                return JSON.parse(data);
            } else {
                console.log('No existing groups file found. Starting with an empty list.');
                return [];
            }
        } catch (error) {
            console.error('Error loading groups:', error);
            return [];
        }
    }

    saveGroups() {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.groups, null, 2), 'utf8');
            console.log('Groups saved:', this.groups); // Logging the saved groups
        } catch (error) {
            console.error('Error saving groups:', error);
        }
    }

    saveGroup(group) {
        this.groups.push(group);
        this.saveGroups();
        return group;
    }

    getGroups() {
        return this.groups;
    }
}

module.exports = Database;
