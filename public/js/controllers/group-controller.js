import GroupService from '../services/group-service.js';

// Function to initialize event listeners
function initGroupController() {
    const addGroupButton = document.getElementById('add-group');
    addGroupButton.addEventListener('click', createNewGroup);
}

// Function to create a new group
async function createNewGroup() {
    try {
        const newGroup = await GroupService.createGroup();
        renderNewGroup(newGroup);
    } catch (error) {
        console.error('Error creating new group:', error);
    }
}

// Function to render the new group using Handlebars
function renderNewGroup(group) {
    const templateSource = document.getElementById('group-template').innerHTML;
    const template = Handlebars.compile(templateSource);
    const html = template(group);

    const groupList = document.getElementById('group-list');
    groupList.insertAdjacentHTML('beforeend', html);
}

// Initialize the controller
document.addEventListener('DOMContentLoaded', initGroupController);
