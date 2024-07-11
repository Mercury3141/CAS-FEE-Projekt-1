import {addItemToGroup} from './item-controller.js';
import {getGroups, saveGroup} from '../services/group-service.js';

document.addEventListener('DOMContentLoaded', async () => {
    const addGroupButton = document.getElementById('add-group');

    addGroupButton.addEventListener('click', async () => {
        const newGroup = await createNewGroup();
        const savedGroup = await saveGroup(newGroup);
        console.log('Saved Group:', savedGroup);
        displayGroup(savedGroup);
    });

    async function createNewGroup() {
        const groupId = Date.now(); // Unique ID for the group
        const order = document.querySelectorAll('.group').length;

        const context = {
            id: groupId,
            order: order
        };

        const groupTemplate = document.getElementById('group-template').innerHTML;
        const compiledGroupTemplate = Handlebars.compile(groupTemplate);
        const groupHTML = compiledGroupTemplate(context);

        const groupList = document.getElementById('group-list');
        groupList.insertAdjacentHTML('beforeend', groupHTML);

        const addItemButton = document.getElementById(`add-item-${groupId}`);
        addItemButton.addEventListener('click', () => addItemToGroup(groupId));

        return context;
    }

    async function loadGroups() {
        const groups = await getGroups();
        groups.forEach(group => displayGroup(group));
    }

    function displayGroup(group) {
        const groupTemplate = document.getElementById('group-template').innerHTML;
        const compiledGroupTemplate = Handlebars.compile(groupTemplate);
        const groupHTML = compiledGroupTemplate(group);
        const groupList = document.getElementById('group-list');
        groupList.insertAdjacentHTML('beforeend', groupHTML);
    }

    loadGroups();
});
