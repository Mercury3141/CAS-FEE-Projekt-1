import { GroupService } from '../services/group-service.js';
import { ItemService } from '../services/item-service.js';

document.addEventListener('DOMContentLoaded', async () => {
    const groupService = new GroupService();
    const itemService = new ItemService();

    const addGroupButton = document.getElementById('add-group');
    const sortImportantButton = document.getElementById('sort-important');
    const sortDateButton = document.getElementById('sort-date');
    const clearButton = document.getElementById('clear');
    const groupContainer = document.getElementById('group-container');

    // Function to check if any checkbox is checked or if any input field is empty
    function updateClearButtonColor() {
        const anyChecked = groupContainer.querySelector('.group input[type="checkbox"]:checked') ||
            groupContainer.querySelector('.item input[type="checkbox"]:checked');
        const anyEmptyInput = Array.from(groupContainer.querySelectorAll('.group input[type="text"], .item input[type="text"]'))
            .some(input => input.value.trim() === '');

        if (anyChecked || anyEmptyInput) {
            clearButton.classList.add('color-caution');
            clearButton.disabled = false;
        } else {
            clearButton.classList.remove('color-caution');
            clearButton.disabled = true;
        }
    }

    // Add event listeners to all checkboxes and input fields
    groupContainer.addEventListener('change', (event) => {
        if (event.target.matches('.group input[type="checkbox"]') || event.target.matches('.item input[type="checkbox"]')) {
            updateClearButtonColor();
        }
    });

    groupContainer.addEventListener('input', (event) => {
        if (event.target.matches('.group input[type="text"]') || event.target.matches('.item input[type="text"]')) {
            updateClearButtonColor();
        }
    });

    // Initial check
    updateClearButtonColor();

    // Function to render a group
    function renderGroup(group) {
        const template = document.getElementById('group-template').innerHTML;
        const compiledTemplate = Handlebars.compile(template);
        return compiledTemplate(group);
    }

    // Function to render an item
    function renderItem(item, groupId) {
        const template = document.getElementById('item-template').innerHTML;
        const compiledTemplate = Handlebars.compile(template);
        return compiledTemplate({ ...item, groupId });
    }

    // Load groups and items
    const groups = await groupService.getAllGroups();
    for (const group of groups) {
        const groupHTML = renderGroup(group);
        document.getElementById('group-list').insertAdjacentHTML('beforeend', groupHTML);

        const items = await itemService.getItemsByGroupId(group.id);
        for (const item of items) {
            const itemHTML = renderItem(item, group.id);
            document.getElementById(`item-list-${group.id}`).insertAdjacentHTML('beforeend', itemHTML);
        }
    }

    // Handling group adding
    addGroupButton.addEventListener('click', async () => {
        const newGroup = await groupService.createGroup();
        const groupHTML = renderGroup(newGroup);
        document.getElementById('group-list').insertAdjacentHTML('beforeend', groupHTML);
        updateClearButtonColor(); // Check button state after adding a new group
    });

    // Handling item adding within a group
    groupContainer.addEventListener('click', async (event) => {
        if (event.target.matches('.add-item')) {
            const groupId = event.target.getAttribute('data-group');
            const newItem = await itemService.createItem(groupId);
            const itemHTML = renderItem(newItem, groupId);
            document.getElementById(`item-list-${groupId}`).insertAdjacentHTML('beforeend', itemHTML);
            updateClearButtonColor(); // Check button state after adding a new item
        }
    });

    // Handling sorting by importance
    sortImportantButton.addEventListener('click', () => {
        console.log('Sort by importance button clicked');
    });

    // Handling sorting by date
    sortDateButton.addEventListener('click', () => {
        console.log('Sort by date button clicked');
    });

    // Handling clear button functionality
    clearButton.addEventListener('click', async () => {
        console.log('Clear button clicked');

        // Deleting checked groups
        const checkedGroups = groupContainer.querySelectorAll('.item-group input[type="checkbox"]:checked');
        for (const checkbox of checkedGroups) {
            const group = checkbox.closest('.group');
            const groupId = group.getAttribute('data-id');
            const hasNonEmptyItem = Array.from(group.querySelectorAll('.item input[type="text"]'))
                .some(input => input.value.trim() !== '');

            if (!hasNonEmptyItem) {
                await groupService.deleteGroup(groupId);
                await itemService.deleteItemsByGroupId(groupId);
                group.remove();
            }
        }

        // Deleting checked individual items
        const checkedItems = groupContainer.querySelectorAll('.item > input[type="checkbox"]:checked');
        for (const checkbox of checkedItems) {
            const item = checkbox.closest('.item');
            const itemId = item.getAttribute('data-id');
            await itemService.deleteItem(itemId);
            item.remove();
        }

        // Deleting empty items within groups
        const groups = groupContainer.querySelectorAll('.group');
        for (const group of groups) {
            const groupId = group.getAttribute('data-id');
            const items = group.querySelectorAll('.item');
            let hasNonEmptyItem = false;
            for (const item of items) {
                const input = item.querySelector('input[type="text"]');
                if (input && input.value.trim() === '') {
                    const itemId = item.getAttribute('data-id');
                    await itemService.deleteItem(itemId);
                    item.remove();
                } else {
                    hasNonEmptyItem = true;
                }
            }
            // Retain group header if there are non-empty items left
            if (hasNonEmptyItem) {
                const itemGroup = group.querySelector('.item-group');
                if (itemGroup) {
                    const itemGroupCheckbox = itemGroup.querySelector('input[type="checkbox"]');
                    itemGroupCheckbox.checked = false; // Uncheck the header checkbox if it's checked
                }
            } else {
                await groupService.deleteGroup(groupId);
                group.remove();
            }
        }

        updateClearButtonColor();
    });
});
