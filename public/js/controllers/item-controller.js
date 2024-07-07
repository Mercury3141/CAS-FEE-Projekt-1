import { ItemService } from '../services/item-service.js';

const btnAddGroup = document.querySelector("#add-group");
const mainContainer = document.querySelector("#main-container");

const groupRenderer = Handlebars.compile(document.querySelector("#group-template").innerHTML);

btnAddGroup.addEventListener("click", async event => {
    event.preventDefault();
    const newGroup = { groupName: 'New Group', items: [] };
    await ItemService.addGroup(newGroup);
    renderGroups();
});

mainContainer.addEventListener("click", async event => {
    if (event.target.classList.contains("js-delete")) {
        await ItemService.deleteGroup(event.target.dataset.id);
        await renderGroups();
    }
});

async function renderGroups() {
    const groups = await ItemService.getGroups();
    mainContainer.innerHTML = groupRenderer({ groups });
}

document.addEventListener('DOMContentLoaded', () => {
    renderGroups();
});
