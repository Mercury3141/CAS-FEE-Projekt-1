// public/js/controllers/index-controller.js

import { GroupService } from '../services/group-service.js';

// Declare constants
const addGroupButton = document.getElementById('add-group');
const groupService = new GroupService();

// Define functions
function addNewGroup() {
    groupService.addGroup();
}

function initializeEventListeners() {
    addGroupButton.addEventListener('click', addNewGroup);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
});
