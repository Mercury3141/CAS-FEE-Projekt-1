const fileService = require('../services/file-service.js');

class GroupModel {
    async getAllGroups() {
        const data = await fileService.readData();
        return data.groups;
    }

    async createGroup(group) {
        const data = await fileService.readData();
        group.id = Date.now();
        data.groups.push(group);
        await fileService.writeData(data);
        return group;
    }

    async updateGroup(id, updatedGroup) {
        const data = await fileService.readData();
        const groupIndex = data.groups.findIndex(group => group.id === id);
        if (groupIndex !== -1) {
            data.groups[groupIndex] = { ...data.groups[groupIndex], ...updatedGroup };
            await fileService.writeData(data);
            return data.groups[groupIndex];
        }
        throw new Error('Group not found');
    }

    async deleteGroup(id) {
        const data = await fileService.readData();
        data.groups = data.groups.filter(group => group.id !== id);
        await fileService.writeData(data);
    }
}

module.exports = new GroupModel();
