import fs from 'fs-extra';
import path from 'path';

const dataFilePath = path.join(path.dirname(import.meta.url), '../data/data.json');

class GroupStore {
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

    async getAllGroups() {
        const data = await this.readData();
        return data.groups;
    }

    async addGroup(group) {
        const data = await this.readData();
        group.id = Date.now(); // Simple unique ID generation
        data.groups.push(group);
        await this.writeData(data);
        return group;
    }

    async updateGroup(id, updatedGroup) {
        const data = await this.readData();
        const groupIndex = data.groups.findIndex(group => group.id === id);
        if (groupIndex !== -1) {
            data.groups[groupIndex] = { ...data.groups[groupIndex], ...updatedGroup };
            await this.writeData(data);
            return data.groups[groupIndex];
        }
        throw new Error('Group not found');
    }

    async deleteGroup(id) {
        const data = await this.readData();
        data.groups = data.groups.filter(group => group.id !== id);
        await this.writeData(data);
    }
}

export default new GroupStore();
