const fs = require('fs');
const path = require('path');
const groupsFilePath = path.join(__dirname, '../data/groups.db');

function saveGroupId(groupId) {
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
            groups.push({ id: groupId });

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
    saveGroupId
};
