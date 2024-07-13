const fs = require('fs');
const path = require('path');
const groupsFilePath = path.join(__dirname, '../data/groups.db');

function saveGroupsData(groupsData) {
    return new Promise((resolve, reject) => {
        fs.writeFile(groupsFilePath, JSON.stringify(groupsData, null, 2), (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

module.exports = {
    saveGroupsData
};
