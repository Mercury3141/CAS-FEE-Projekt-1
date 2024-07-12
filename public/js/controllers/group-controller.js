import groupService from '../services/group-service.js';
import ItemController from './item-controller.js';

class GroupController {
    constructor() {
        this.init();
    }

    async init() {
        await this.loadGroups();
        document.getElementById('add-group').addEventListener('click', () => this.addGroup());
    }

    async loadGroups() {
        const groups = await groupService.getGroups();
        this.renderGroups(groups);
    }

    async addGroup() {
        const newGroup = await groupService.createGroup({ name: 'New Group' });
        this.renderGroup(newGroup);
    }

    renderGroups(groups) {
        const template = document.getElementById('group-template').innerHTML;
        const compiledTemplate = Handlebars.compile(template);
        const groupList = document.getElementById('group-list');
        groupList.innerHTML = groups.map(group => compiledTemplate(group)).join('');
        groups.forEach(group => new ItemController(group.id));
    }

    renderGroup(group) {
        const template = document.getElementById('group-template').innerHTML;
        const compiledTemplate = Handlebars.compile(template);
        const groupList = document.getElementById('group-list');
        groupList.innerHTML += compiledTemplate(group);
        new ItemController(group.id);
    }
}

export default new GroupController();
