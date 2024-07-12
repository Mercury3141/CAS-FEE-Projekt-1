const fs = require('fs-extra');
const path = require('path');
const dataFilePath = path.join(__dirname, '../data/data.json');

class FileService {
    async readData() {
        try {
            const data = await fs.readFile(dataFilePath, 'utf8');
            console.log('Raw data from file:', data);  // Add this line for debugging
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading data file:', error);
            return { groups: [], items: [] };
        }
    }

    async writeData(data) {
        try {
            await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Error writing data file:', error);
        }
    }
}

module.exports = new FileService();
