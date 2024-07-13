import GroupService from '../services/group-service.js';
import ItemService from '../services/item-service.js';

document.addEventListener('DOMContentLoaded', function() {
    const groupList = document.getElementById('group-list');
    const addGroupButton = document.getElementById('add-group');
    const groupTemplateSource = document.getElementById('group-template').innerHTML;
    const itemTemplateSource = document.getElementById('item-template').innerHTML;
    const groupTemplate = Handlebars.compile(groupTemplateSource);
    const itemTemplate = Handlebars.compile(itemTemplateSource);
    let groupIdCounter = Date.now();
    let itemIdCounter = Date.now();

    addGroupButton.addEventListener('click', async function() {
        const newGroup = {
            id: groupIdCounter++,
            order: document.querySelectorAll('.group').length + 1,
            checked: false,
            textContent: "New Group"
        };

        try {
            await GroupService.createGroup(newGroup);
            const newGroupHtml = groupTemplate(newGroup);
            groupList.innerHTML += newGroupHtml;
        } catch (error) {
            console.error('Error creating group:', error);
        }
    });

    groupList.addEventListener('click', async function(event) {
        if (event.target.classList.contains('add-item')) {
            const groupId = event.target.dataset.group;
            const newItem = {
                id: itemIdCounter++,
                groupId: groupId,
                order: document.querySelectorAll(`#item-list-${groupId} .item`).length + 1,
                checked: false,
                textContent: "New Item",
                important: false,
                dueDate: null
            };

            try {
                await ItemService.createItem(newItem);
                const newItemHtml = itemTemplate(newItem);
                document.getElementById(`item-list-${groupId}`).innerHTML += newItemHtml;
            } catch (error) {
                console.error('Error creating item:', error);
            }
        }

        if (event.target.classList.contains('delete-item')) {
            const itemId = event.target.dataset.id;
            try {
                await ItemService.deleteItem(itemId);
                event.target.closest('.item').remove();
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    });

    async function saveAllData() {
        try {
            const groups = await GroupService.getAllGroups();
            const items = await ItemService.getAllItems();

            renderGroups(groups);
            renderItems(items);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    async function loadData() {
        try {
            const groups = await GroupService.getAllGroups();
            const items = await ItemService.getAllItems();

            renderGroups(groups);
            renderItems(items);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    function renderGroups(groups) {
        groupList.innerHTML = ''; // Clear existing content
        groups.forEach(group => {
            const groupHtml = groupTemplate(group);
            groupList.innerHTML += groupHtml;
        });
    }

    function renderItems(items) {
        items.forEach(item => {
            const itemHtml = itemTemplate(item);
            const itemList = document.getElementById(`item-list-${item.groupId}`);
            if (itemList) {
                itemList.innerHTML += itemHtml;
            }
        });
    }

    loadData();

    groupList.addEventListener('change', async function(event) {
        const target = event.target;
        if (target.classList.contains('label-heading') || target.type === 'checkbox' || target.type === 'text' || target.type === 'date') {
            const itemId = target.dataset.id;
            const itemGroup = target.closest('.item').dataset.group;
            const itemData = {
                id: itemId,
                groupId: itemGroup,
                checked: target.checked,
                textContent: target.value,
                important: target.getAttribute('aria-pressed') === 'true',
                dueDate: target.type === 'date' ? target.value : null
            };

            try {
                await ItemService.updateItem(itemId, itemData);
            } catch (error) {
                console.error('Error updating item:', error);
            }
        }
    });
});
