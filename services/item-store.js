const fs = require('fs');
const path = require('path');
const dataFilePath = path.join(__dirname, '../data/groups.db'); // Adjust if items have a separate file

function saveData(data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

function loadData() {
    return new Promise((resolve, reject) => {
        fs.readFile(dataFilePath, 'utf8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    resolve({ groups: [], items: [] });
                } else {
                    reject(err);
                }
            } else {
                try {
                    const parsedData = JSON.parse(data);
                    resolve({
                        groups: parsedData.groups || [],
                        items: parsedData.items || []
                    });
                } catch (e) {
                    reject(e);
                }
            }
        });
    });
}

module.exports = {
    saveData,
    loadData
};
