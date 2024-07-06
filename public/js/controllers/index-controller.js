import { itemService } from '../services/item-service.js'


const btnAddGroup = document.getElementById("add-group");
const btnSortImportant = document.getElementById("sort-important");
const btnSortDate = document.getElementById("sort-date");
const btnClear = document.getElementById("clear");
const groupContainer = document.getElementById("group-container");

const groupRenderer = Handlebars.compile(document.getElementById("group-template").innerHTML);

btnAddGroup.addEventListener("click", async event => {
    event.preventDefault();
    await itemService.createItem(inputPizza.value)
    renderItems();
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
});
