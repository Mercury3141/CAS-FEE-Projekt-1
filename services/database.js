import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, '../data/data.json');

class Database {
    async readData() {
        try {
            const data = await fs.readFile(dataFilePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading data file:', error);
            return { groups: [], items: [] };
        }
    }

    async writeData(data) {
        try {
            await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
        } catch (error) {
            console.error('Error writing data file:', error);
        }
    }
}

export default new Database();
