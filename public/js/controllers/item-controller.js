export function addItemToGroup(groupId) {
    const groupElement = document.getElementById(`group-${groupId}`);
    const itemList = groupElement.querySelector(`#item-list-${groupId}`);
    const itemId = Date.now();

    const context = {
        id: itemId,
        groupId: groupId
    };

    const itemTemplate = document.getElementById('item-template').innerHTML;
    const compiledItemTemplate = Handlebars.compile(itemTemplate);
    const itemHTML = compiledItemTemplate(context);

    itemList.insertAdjacentHTML('beforeend', itemHTML);
}
