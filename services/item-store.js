// services/item-store.js

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Ensure __dirname is available in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'item.db');

class ItemStore {
    static async addGroup(group) {
        const groups = await this.getGroups();
        group.id = this.generateId();
        groups.push(group);
        await fs.writeFile(dbPath, JSON.stringify(groups, null, 2), 'utf-8'); // Ensure the data is a string
        return group;
    }

    static async getGroups() {
        try {
            const data = await fs.readFile(dbPath, 'utf-8');
            return JSON.parse(data.toString()); // Convert buffer to string before parsing
        } catch (error) {
            // If file does not exist or is empty, return an empty array
            if (error.code === 'ENOENT') {
                return [];
            }
            throw error;
        }
    }

    static generateId() {
        return '_' + Math.random().toString(36).substring(2, 11); // Use substring instead of substr
    }
}

export default ItemStore;
