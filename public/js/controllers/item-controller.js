export function addItemToGroup(groupId) {
    const groupElement = document.getElementById(`group-${groupId}`);
    const itemList = groupElement.querySelector(`#item-list-${groupId}`);
    const itemId = Date.now(); // Unique ID for the item

    const context = {
        id: itemId,
        groupId: groupId
    };

    const itemTemplate = document.getElementById('item-template').innerHTML;
    const compiledItemTemplate = Handlebars.compile(itemTemplate);
    const itemHTML = compiledItemTemplate(context);

    itemList.insertAdjacentHTML('beforeend', itemHTML);

    // Here you would typically make a call to your REST API to save the item
    // e.g., saveItem(context);
}
