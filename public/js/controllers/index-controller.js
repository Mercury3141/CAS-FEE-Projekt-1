import groupService from '../services/group-service.js';
import ItemController from './item-controller.js';

class IndexController {
    constructor() {
        this.init();
    }

    async init() {
        try {
            await this.loadGroups();
            document.getElementById('add-group').addEventListener('click', () => this.addGroup());
        } catch (error) {
            console.error('Error initializing IndexController:', error);
        }
    }

    async loadGroups() {
        try {
            const groups = await groupService.getGroups();
            this.renderGroups(groups);
        } catch (error) {
            console.error('Error loading groups:', error);
        }
    }

    async addGroup() {
        try {
            const newGroup = await groupService.createGroup({ name: 'New Group' });
            this.renderGroup(newGroup);
        } catch (error) {
            console.error('Error adding group:', error);
        }
    }

    renderGroups(groups) {
        const template = document.getElementById('group-template').innerHTML;
        const compiledTemplate = Handlebars.compile(template);
        const groupList = document.getElementById('group-list');
        groupList.innerHTML = groups.map(group => compiledTemplate(group)).join('');
        groups.forEach(group => this.initializeItemController(group.id));
    }

    renderGroup(group) {
        const template = document.getElementById('group-template').innerHTML;
        const compiledTemplate = Handlebars.compile(template);
        const groupList = document.getElementById('group-list');
        groupList.innerHTML += compiledTemplate(group);
        this.initializeItemController(group.id);
    }

    initializeItemController(groupId) {
        new ItemController(groupId);
    }
}

export default IndexController;
