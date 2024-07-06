/*
import {itemService} from '../services/item-service.js'

const groupContainer = document.getElementById("group-container");
const groupRenderer = Handlebars.compile(document.getElementById("group-template").innerHTML);

async function renderItems() {
    groupContainer.innerHTML = groupRenderer(await itemService.getItems(itemId))
}

groupContainer.addEventListener("click", async event => {
    if (event.target.getElementById("clear")) {
        await itemService.deleteGroup(event.target.dataset.id);
        renderItems()
    }
});

renderItems();
*/
