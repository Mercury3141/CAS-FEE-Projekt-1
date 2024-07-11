import {promises as fs} from 'fs';

const groupsFilePath = './data/groups.db';

export class GroupStore {
    async getAllGroups() {
        const data = await fs.readFile(groupsFilePath, 'utf-8');
        return JSON.parse(data);
    }

    async saveGroups(groups) {
        await fs.writeFile(groupsFilePath, JSON.stringify(groups, null, 2), 'utf-8');
    }

    async addGroup(group) {
        const groups = await this.getAllGroups();
        groups.push(group);
        await this.saveGroups(groups);
    }

    async deleteGroup(groupId) {
        let groups = await this.getAllGroups();
        groups = groups.filter(group => group.id !== groupId);
        await this.saveGroups(groups);
    }
}
