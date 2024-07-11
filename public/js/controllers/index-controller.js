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
    const toolbarButtons = [addGroupButton, sortDateButton, clearButton]; // All other buttons except sortImportantButton

    function categorizeDueDate(dueDate) {
        const today = new Date();
        const date = new Date(dueDate);
        const oneDay = 24 * 60 * 60 * 1000;
        const dayDifference = Math.floor((date - today) / oneDay);

        if (dayDifference < -1) {
            return 'In the Past';
        } else if (dayDifference === -1) {
            return 'Yesterday';
        } else if (dayDifference === 0) {
            return 'Today';
        } else if (dayDifference === 1) {
            return 'Tomorrow';
        } else if (dayDifference < 7) {
            return 'This Week';
        } else if (date.getMonth() === today.getMonth()) {
            return 'This Month';
        } else {
            return 'Upcoming';
        }
    }

    // Function to update the due date label based on the categorized due date
    function updateDueDateLabel(inputElement) {
        const dueDate = inputElement.value;
        const itemId = inputElement.closest('.item').getAttribute('data-id');
        const groupId = inputElement.closest('.item').getAttribute('data-group');
        const dueDateElement = document.getElementById(`due-date-text-${groupId}-${itemId}`);
        const dueDateCategory = categorizeDueDate(dueDate);

        if (dueDate) {
            if (dueDateElement) {
                dueDateElement.textContent = dueDateCategory;
            } else {
                const dueDateLabel = document.createElement('div');
                dueDateLabel.className = 'label-due-date';
                dueDateLabel.id = `due-date-text-${groupId}-${itemId}`;
                dueDateLabel.textContent = dueDateCategory;
                inputElement.closest('.item').insertAdjacentElement('afterend', dueDateLabel);
            }
        } else if (dueDateElement) {
            dueDateElement.remove();
        }

        updateItemDueDate(itemId, dueDate);
    }

    async function updateItemDueDate(itemId, dueDate) {
        const item = {
            id: parseInt(itemId),
            dueDate: dueDate
        };
        await itemService.updateItem(itemId, item);
    }

    // Function to check if any reminder item is marked as important
    function updateSortImportantButton() {
        const anyImportant = groupContainer.querySelector('.item button.color-important');
        if (anyImportant) {
            sortImportantButton.classList.remove('color-text-inactive');
            sortImportantButton.disabled = false; // Enable the button
        } else {
            sortImportantButton.classList.add('color-text-inactive');
            sortImportantButton.disabled = true; // Disable the button

            // Remove all outline-important classes when no important items are left
            document.querySelectorAll('.outline-important').forEach(element => {
                element.classList.remove('outline-important');
            });
        }
    }

    // Function to check if any checkbox is checked or if any input field is empty and deletable
    function updateClearButtonColor() {
        const anyChecked = groupContainer.querySelector('.group input[type="checkbox"]:checked') ||
            groupContainer.querySelector('.item input[type="checkbox"]:checked');

        const anyEmptyDeletableInput = Array.from(groupContainer.querySelectorAll('.group')).some(group => {
            const groupHeaderInput = group.querySelector('.label-heading');
            const hasCustomHeader = groupHeaderInput && groupHeaderInput.value.trim() !== '';
            const hasNonEmptyItem = Array.from(group.querySelectorAll('.item input[type="text"]'))
                .some(input => input.value.trim() !== '');

            // A group is deletable if the header is empty and it has no non-empty items
            const isDeletableGroup = !hasCustomHeader && !hasNonEmptyItem;

            return isDeletableGroup ||
                Array.from(group.querySelectorAll('.item input[type="text"]')).some(input => input.value.trim() === '');
        });

        if (anyChecked || anyEmptyDeletableInput) {
            clearButton.classList.add('color-caution');
            clearButton.disabled = false;
        } else {
            clearButton.classList.remove('color-caution');
            clearButton.disabled = true;
        }
    }

    // Function to filter items by importance
    function filterImportantItems() {
        const showOnlyImportant = sortImportantButton.classList.contains('color-important');
        document.querySelectorAll('.group').forEach(group => {
            let hasImportantItem = false;
            group.querySelectorAll('.item').forEach(item => {
                const isImportant = item.querySelector('#toggle-important').classList.contains('color-important');
                if (showOnlyImportant) {
                    if (isImportant) {
                        item.style.display = 'flex';
                        hasImportantItem = true;
                    } else {
                        item.style.display = 'none';
                    }
                } else {
                    item.style.display = 'flex';
                }
            });
            group.style.display = hasImportantItem || !showOnlyImportant ? 'flex' : 'none';
        });
    }

    // Function to update toolbar button states
    function updateToolbarButtons() {
        const showOnlyImportant = sortImportantButton.classList.contains('color-important');
        toolbarButtons.forEach(button => {
            if (showOnlyImportant) {
                button.classList.add('color-text-inactive');
                button.disabled = true;
            } else {
                button.classList.remove('color-text-inactive');
                button.disabled = false;
            }
        });
    }

    // Add event listeners to all checkboxes and input fields
    groupContainer.addEventListener('change', (event) => {
        if (event.target.matches('.group input[type="checkbox"]') || event.target.matches('.item input[type="checkbox"]')) {
            updateClearButtonColor();
        } else if (event.target.matches('.item input[type="date"]')) {
            updateDueDateLabel(event.target);
        }
    });

    // Handling importance toggling for items
    groupContainer.addEventListener('click', async (event) => {
        if (event.target.matches('#toggle-important')) {
            const button = event.target;
            const itemId = button.closest('.item').getAttribute('data-id');
            const isImportant = button.classList.toggle('color-important');

            button.textContent = isImportant ? '!!' : '!';

            const item = {
                id: parseInt(itemId),
                important: isImportant
            };
            await itemService.updateItem(itemId, item);
            updateSortImportantButton();
            filterImportantItems(); // Filter items after toggling importance

            // Check and update toolbar button states if no important items left
            if (!groupContainer.querySelector('.item button.color-important')) {
                sortImportantButton.classList.remove('color-important');
                filterImportantItems(); // Re-filter items after toggling the toolbar button
                updateToolbarButtons(); // Update other toolbar buttons
            }
        }
    });

    // Handling the sorting button click
    sortImportantButton.addEventListener('click', () => {
        if (!sortImportantButton.classList.contains('color-text-inactive')) {
            sortImportantButton.classList.toggle('color-important');
            document.querySelectorAll('.group').forEach(group => {
                group.classList.toggle('outline-important');
            });
            filterImportantItems(); // Filter items when toggling the toolbar button
            updateToolbarButtons(); // Update other toolbar buttons
        }
    });

    // Initial checks
    updateClearButtonColor();
    updateSortImportantButton();

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
        initializeGroupSortable(); // Re-initialize Sortable for the new group
        initializeItemSortable(); // Re-initialize Sortable for the new items
    });

    // Handling item adding within a group
    groupContainer.addEventListener('click', async (event) => {
        if (event.target.matches('.add-item')) {
            const groupId = event.target.getAttribute('data-group');
            const newItem = await itemService.createItem(groupId);
            const itemHTML = renderItem(newItem, groupId);
            document.getElementById(`item-list-${groupId}`).insertAdjacentHTML('beforeend', itemHTML);
            updateClearButtonColor(); // Check button state after adding a new item
            initializeItemSortable(); // Re-initialize Sortable for the new item
            updateSortImportantButton(); // Check button state after adding a new item
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

        // Deleting empty items within groups, but never deleting groups with custom inputted headers
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
        updateSortImportantButton();
        filterImportantItems(); // Filter items after clearing
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

    // Initialize Sortable.js for groups
    new Sortable(groupContainer, {
        animation: 150,
        handle: '.item-group',
        onEnd: async (event) => {
            const movedGroupId = event.item.getAttribute('data-id');
            const newOrder = Array.from(groupContainer.children).map((child, index) => ({
                id: child.getAttribute('data-id'),
                order: index
            }));
            await updateGroupOrder(newOrder);
        }
    });

    // Initialize Sortable.js for items within each group
    function initializeGroupSortable() {
        document.querySelectorAll('.group').forEach(group => {
            const itemList = group.querySelector('ul');
            new Sortable(itemList, {
                animation: 150,
                group: 'shared',
                onEnd: async (event) => {
                    const movedItemId = event.item.getAttribute('data-id');
                    const targetGroupId = event.to.closest('.group').getAttribute('data-id');
                    const newOrder = Array.from(event.to.children).map((child, index) => ({
                        id: child.getAttribute('data-id'),
                        order: index,
                        groupId: parseInt(targetGroupId)
                    }));
                    await updateItemGroupAndOrder(newOrder);
                }
            });
        });
    }

    // Initialize Sortable.js for items within each group
    function initializeItemSortable() {
        document.querySelectorAll('.group ul').forEach(itemList => {
            new Sortable(itemList, {
                animation: 150,
                group: 'shared',
                onEnd: async (event) => {
                    const movedItemId = event.item.getAttribute('data-id');
                    const targetGroupId = event.to.closest('.group').getAttribute('data-id');
                    const newOrder = Array.from(event.to.children).map((child, index) => ({
                        id: child.getAttribute('data-id'),
                        order: index,
                        groupId: parseInt(targetGroupId)
                    }));
                    await updateItemGroupAndOrder(newOrder);
                }
            });
        });
    }

    // Update group order in the database
    async function updateGroupOrder(newOrder) {
        for (let group of newOrder) {
            await groupService.updateGroup(group.id, { order: group.order });
        }
    }

    // Update item group and order in the database
    async function updateItemGroupAndOrder(newOrder) {
        for (let item of newOrder) {
            await itemService.updateItem(item.id, { order: item.order, groupId: item.groupId });
        }
    }

    // Initialize Sortable.js for existing groups and items
    initializeGroupSortable();
    initializeItemSortable();
});
