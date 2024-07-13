const fs = require('fs');
const path = require('path');
const dataFilePath = path.join(__dirname, '../data/groups.db');

function saveData(data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8', (err) => {  // Specify 'utf8' encoding
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

function loadData() {
    return new Promise((resolve, reject) => {
        fs.readFile(dataFilePath, 'utf8', (err, data) => {  // Specify 'utf8' encoding
            if (err) {
                if (err.code === 'ENOENT') {
                    resolve({ groups: [], items: [] });
                } else {
                    reject(err);
                }
            } else {
                try {
                    const parsedData = JSON.parse(data);  // Parse the string data
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
