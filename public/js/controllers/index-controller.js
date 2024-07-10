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

    groupContainer.addEventListener('input', async (event) => {
        if (event.target.matches('.group input[type="text"]')) {
            const groupId = event.target.closest('.group').getAttribute('data-id');
            const group = {
                id: parseInt(groupId),
                name: event.target.value
            };
            await groupService.updateGroup(groupId, group);
        } else if (event.target.matches('.item input[type="text"]')) {
            const itemId = event.target.closest('.item').getAttribute('data-id');
            const item = {
                id: parseInt(itemId),
                description: event.target.value
            };
            await itemService.updateItem(itemId, item);
        }
        updateClearButtonColor();
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
            const groupHeaderInput = group.querySelector('.label-heading');
            const hasNonEmptyItem = Array.from(group.querySelectorAll('.item input[type="text"]'))
                .some(input => input.value.trim() !== '');

            // Retain group if it has non-empty items or the group header has text
            if (!hasNonEmptyItem && groupHeaderInput.value.trim() === '') {
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

        // Deleting empty items within groups, but never deleting groups with custom inputed headers
        const groups = groupContainer.querySelectorAll('.group');
        for (const group of groups) {
            const groupId = group.getAttribute('data-id');
            const items = group.querySelectorAll('.item');
            let hasNonEmptyItem = false;
            let hasCustomHeader = false;
            const groupHeaderInput = group.querySelector('.label-heading');
            if (groupHeaderInput && groupHeaderInput.value.trim() !== '') {
                hasCustomHeader = true;
            }
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
            // Retain group header if there are non-empty items left or if it has a custom header
            if (hasNonEmptyItem || hasCustomHeader) {
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

    // Toggle all reminder items within a group when the group header checkbox is toggled
    groupContainer.addEventListener('change', (event) => {
        if (event.target.matches('.item-group input[type="checkbox"]')) {
            const group = event.target.closest('.group');
            const isChecked = event.target.checked;
            const items = group.querySelectorAll('.item input[type="checkbox"]');
            items.forEach(itemCheckbox => {
                itemCheckbox.checked = isChecked;
            });
            updateClearButtonColor();
        }
    });
});
