const GroupStore = require('../stores/group-store.js');

class GroupService {
    constructor() {
        this.groupStore = new GroupStore();
    }

    async getAllGroups() {
        return await this.groupStore.getAllGroups();
    }

    async createGroup(name) {
        const newGroup = { id: Date.now().toString(), name, items: [] };
        await this.groupStore.addGroup(newGroup);
        return newGroup;
    }

    async deleteGroup(groupId) {
        await this.groupStore.deleteGroup(groupId);
    }

    async updateGroup(groupId, updatedGroup) {
        await this.groupStore.updateGroup(groupId, updatedGroup);
    }
}

module.exports = GroupService;
