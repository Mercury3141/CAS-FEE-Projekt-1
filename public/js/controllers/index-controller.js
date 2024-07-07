document.getElementById('add-group').addEventListener('click', function() {
    const mainContainer = document.getElementById('main-container');

    const templateSource = document.getElementById('group-template').innerHTML;
    const template = Handlebars.compile(templateSource);

    const newGroupData = {
        groups: [{
            id: Date.now(),  // Generate a unique id based on the current timestamp
            groupName: 'New Group',
            items: []  // Initially, the new group has no items
        }]
    };

    const newGroupHTML = template(newGroupData);

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = newGroupHTML;

    mainContainer.appendChild(tempDiv.firstElementChild);
});



/*
import { itemService } from '../services/item-service.js'


const btnAddGroup = document.getElementById("add-group");
const btnSortImportant = document.getElementById("sort-important");
const btnSortDate = document.getElementById("sort-date");
const btnClear = document.getElementById("clear");
const groupContainer = document.getElementById("group-container");
const groupRenderer = Handlebars.compile(document.getElementById("group-template").innerHTML);

btnAddGroup.addEventListener("click", async event => {
    event.preventDefault();
    await itemService.createGroup();
    await renderItems();
});

async function renderItems() {
    groupContainer.innerHTML = groupRenderer({orders: await itemService.getItems()});
}

groupContainer.addEventListener("click", async function (event) {
    if(event.target.id === "add-group") {
        await itemService.createGroup(event.target.dataset.id);
        await renderItems()
    }

    //further event functions...
});*/
