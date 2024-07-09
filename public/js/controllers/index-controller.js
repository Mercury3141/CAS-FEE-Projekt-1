// public/js/controllers/index-controller.js

import { GroupService } from '../services/group-service.js';

document.addEventListener('DOMContentLoaded', () => {
    const addGroupButton = document.getElementById('add-group');
    const groupService = new GroupService();

    addGroupButton.addEventListener('click', () => {
        groupService.addGroup();
    });
});
