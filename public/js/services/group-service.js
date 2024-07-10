export class GroupService {
    constructor() {
        this.groups = [];
        this.nextId = 1;
    }

    async getAllGroups() {
        return this.groups;
    }

    async createGroup() {
        const newGroup = { id: this.nextId++, name: 'New Group', items: [] };
        this.groups.push(newGroup);
        return newGroup;
    }

    async deleteGroup(groupId) {
        this.groups = this.groups.filter(group => group.id !== groupId);
    }

    async updateGroup(groupId, updatedGroup) {
        const groupIndex = this.groups.findIndex(group => group.id === groupId);
        if (groupIndex !== -1) {
            this.groups[groupIndex] = { ...this.groups[groupIndex], ...updatedGroup };
        }
    }
}
