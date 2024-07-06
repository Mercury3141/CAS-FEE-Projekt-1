import {itemService} from '../services/item-service.js'

const GroupContainer = document.getElementById("group-container");
const groupRenderer = Handlebars.compile(document.getElementById("group-template").innerHTML);

async function renderOrder() {
    GroupContainer.innerHTML = groupRenderer(await itemService.getItems(itemId))
}

groupContainer.addEventListener("click", async event => {
    if (event.target.getElementById("clear")) {
        await orderService.deleteGroup(event.target.dataset.id);
        renderItems()
    }
});

renderItems();
