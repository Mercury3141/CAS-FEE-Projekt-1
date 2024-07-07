const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'groups.json');
let groups = [];

function loadGroups() {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        groups = JSON.parse(data);
    }
}

function saveGroups() {
    fs.writeFileSync(filePath, JSON.stringify(groups, null, 2), 'utf8');
}

module.exports = {
    saveGroup: (newGroup) => {
        loadGroups();
        groups.push(newGroup);
        saveGroups();
        return newGroup;
    },
    // Add other functions similarly
};

loadGroups(); // Initial load when the module is loaded
