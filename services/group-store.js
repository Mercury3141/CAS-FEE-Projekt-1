const fs = require('fs');
const path = require('path');
const groupsFilePath = path.join(__dirname, '../data/groups.db');

function saveGroupData(groupData) {
    return new Promise((resolve, reject) => {
        fs.readFile(groupsFilePath, 'utf8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    data = '[]'; // File doesn't exist, create a new array
                } else {
                    return reject(err);
                }
            }

            const groups = JSON.parse(data);
            const existingGroupIndex = groups.findIndex(group => group.id === groupData.id);

            if (existingGroupIndex >= 0) {
                groups[existingGroupIndex] = groupData; // Update existing group
            } else {
                groups.push(groupData); // Add new group
            }

            fs.writeFile(groupsFilePath, JSON.stringify(groups, null, 2), (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

module.exports = {
    saveGroupData
};
