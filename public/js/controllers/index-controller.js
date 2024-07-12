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
            const data = await groupService.getGroups();
            this.renderGroups(data.groups, data.items);
        } catch (error) {
            console.error('Error loading groups:', error);
        }
    }

    async addGroup() {
        try {
            const newGroup = await groupService.createGroup({
                order: Date.now(),
                checked: false,
                textContent: 'New Group'
            });
            this.renderGroup(newGroup);
        } catch (error) {
            console.error('Error adding group:', error);
        }
    }

    renderGroups(groups, items) {
        const template = document.getElementById('group-template').innerHTML;
        const compiledTemplate = Handlebars.compile(template);
        const groupList = document.getElementById('group-list');
        groupList.innerHTML = groups.map(group => compiledTemplate(group)).join('');
        groups.forEach(group => this.initializeItemController(group.id, items));
    }

    renderGroup(group) {
        const template = document.getElementById('group-template').innerHTML;
        const compiledTemplate = Handlebars.compile(template);
        const groupList = document.getElementById('group-list');
        groupList.innerHTML += compiledTemplate(group);
        this.initializeItemController(group.id);
    }

    initializeItemController(groupId, items) {
        new ItemController(groupId, items);
    }
}

export default IndexController;
