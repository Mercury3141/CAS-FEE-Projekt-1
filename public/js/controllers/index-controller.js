document.addEventListener('DOMContentLoaded', () => {
    const groupContainer = document.getElementById('group-container');
    const addGroupButton = document.getElementById('add-group');

    addGroupButton.addEventListener('click', createNewGroup);

    function createNewGroup() {
        const groupId = Date.now(); // Unique ID for the group
        const order = document.querySelectorAll('.group').length;

        const context = {
            id: groupId,
            order: order
        };

        const groupTemplate = document.getElementById('group-template').innerHTML;
        const compiledGroupTemplate = Handlebars.compile(groupTemplate);
        const groupHTML = compiledGroupTemplate(context);

        const groupList = document.getElementById('group-list');
        groupList.insertAdjacentHTML('beforeend', groupHTML);

        const addItemButton = document.getElementById(`add-item-${groupId}`);
        addItemButton.addEventListener('click', () => addItemToGroup(groupId));
    }

    function addItemToGroup(groupId) {
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
    }
});
