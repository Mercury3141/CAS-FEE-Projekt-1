import Database from './database.js';

class GroupStore {
    async getAllGroups() {
        const data = await Database.readData();
        return data.groups;
    }

    async addGroup(group) {
        const data = await Database.readData();
        group.id = Date.now(); // Simple unique ID generation
        data.groups.push(group);
        await Database.writeData(data);
        return group;
    }

    async updateGroup(id, updatedGroup) {
        const data = await Database.readData();
        const groupIndex = data.groups.findIndex(group => group.id === id);
        if (groupIndex !== -1) {
            data.groups[groupIndex] = { ...data.groups[groupIndex], ...updatedGroup };
            await Database.writeData(data);
            return data.groups[groupIndex];
        }
        throw new Error('Group not found');
    }

    async deleteGroup(id) {
        const data = await Database.readData();
        data.groups = data.groups.filter(group => group.id !== id);
        await Database.writeData(data);
    }
}

export default new GroupStore();
