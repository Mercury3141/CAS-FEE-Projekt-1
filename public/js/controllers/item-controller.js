// public/js/controllers/item-controller.js

import { ItemService } from '../services/item-service.js';

class ItemController {
    constructor() {
        this.itemService = new ItemService();
        this.btnAddGroup = document.querySelector("#add-group");
        this.mainContainer = document.querySelector("#main-container");

        if (this.btnAddGroup) {
            this.btnAddGroup.addEventListener("click", async (event) => {
                event.preventDefault();
                const newGroup = { groupName: 'New Group', items: [] };
                await this.itemService.addGroup(newGroup);
                await this.renderGroups();
            });
        } else {
            console.error('Add Group button not found!');
        }

        this.mainContainer.addEventListener("click", async (event) => {
            const target = event.target;
            if (target && target.classList && target.classList.contains("js-delete")) {
                const groupId = target.dataset.id;  // Ensure correct variable naming
                await this.itemService.deleteGroup(groupId);
                await this.renderGroups();
            }
        });

        document.addEventListener('DOMContentLoaded', async () => {
            await this.renderGroups();
        });
    }

    async renderGroups() {
        const groups = await this.itemService.getGroups();
        const groupRenderer = Handlebars.compile(document.querySelector("#group-template").innerHTML);
        this.mainContainer.innerHTML = groupRenderer({ groups });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ItemController();
});
