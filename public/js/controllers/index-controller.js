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
    const toolbarButtons = [addGroupButton, clearButton];

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
        updateSortButtons();
    }

    async function updateItemDueDate(itemId, dueDate) {
        const item = {
            id: parseInt(itemId),
            dueDate: dueDate
        };
        await itemService.updateItem(itemId, item);
    }

    function updateSortButtons() {
        const anyImportant = groupContainer.querySelector('.item button.color-important');
        const anyDate = Array.from(groupContainer.querySelectorAll('.item input[type="date"]')).some(input => input.value);

        if (anyImportant) {
            sortImportantButton.classList.remove('color-text-inactive');
            sortImportantButton.disabled = false;
        } else {
            sortImportantButton.classList.add('color-text-inactive');
            sortImportantButton.disabled = true;
            sortImportantButton.classList.remove('color-important');
        }

        if (anyDate) {
            sortDateButton.classList.remove('color-text-inactive');
            sortDateButton.disabled = false;
        } else {
            sortDateButton.classList.add('color-text-inactive');
            sortDateButton.disabled = true;
            sortDateButton.classList.remove('color-selection');
        }

        updateToolbarButtons();
    }

    function updateClearButtonColor() {
        const anyChecked = groupContainer.querySelector('.group input[type="checkbox"]:checked') ||
            groupContainer.querySelector('.item input[type="checkbox"]:checked');

        const anyEmptyDeletableInput = Array.from(groupContainer.querySelectorAll('.group')).some(group => {
            const groupHeaderInput = group.querySelector('.label-heading');
            const hasCustomHeader = groupHeaderInput && groupHeaderInput.value.trim() !== '';
            const hasNonEmptyItem = Array.from(group.querySelectorAll('.item input[type="text"]'))
                .some(input => input.value.trim() !== '');

            const isDeletableGroup = !hasCustomHeader && !hasNonEmptyItem;

            return isDeletableGroup ||
                Array.from(group.querySelectorAll('.item input[type="text"]')).some(input => input.value.trim() === '');
        });

        if (anyChecked || anyEmptyDeletableInput) {
            clearButton.classList.remove('color-text-inactive');
            clearButton.disabled = false;
        } else {
            clearButton.classList.add('color-text-inactive');
            clearButton.disabled = true;
        }
    }

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
            if (showOnlyImportant) {
                if (hasImportantItem) {
                    group.classList.add('outline-important');
                    group.style.display = 'flex';
                } else {
                    group.classList.remove('outline-important');
                    group.style.display = 'none';
                }
            } else {
                group.classList.remove('outline-important');
                group.style.display = 'flex';
            }
        });
    }

    function filterDateItems() {
        const showDateItems = sortDateButton.classList.contains('color-selection');
        document.querySelectorAll('.group').forEach(group => {
            let hasDateItem = false;
            group.querySelectorAll('.item').forEach(item => {
                const hasDate = item.querySelector('input[type="date"]').value;
                if (showDateItems) {
                    if (hasDate) {
                        item.style.display = 'flex';
                        hasDateItem = true;
                    } else {
                        item.style.display = 'none';
                    }
                } else {
                    item.style.display = 'flex';
                }
            });
            if (showDateItems) {
                if (hasDateItem) {
                    group.classList.add('outline-selection');
                } else {
                    group.classList.remove('outline-selection');
                }
            } else {
                group.classList.remove('outline-selection');
            }
        });
    }

    function updateToolbarButtons() {
        const showOnlyImportant = sortImportantButton.classList.contains('color-important');
        const showDateItems = sortDateButton.classList.contains('color-selection');
        toolbarButtons.forEach(button => {
            if (showOnlyImportant || showDateItems) {
                button.classList.add('color-text-inactive');
                button.disabled = true;
            } else {
                button.classList.remove('color-text-inactive');
                button.disabled = false;
            }
        });

        if (showOnlyImportant) {
            sortDateButton.classList.add('color-text-inactive');
            sortDateButton.disabled = true;
        } else if (showDateItems) {
            sortImportantButton.classList.add('color-text-inactive');
            sortImportantButton.disabled = true;
        } else {
            sortImportantButton.classList.remove('color-text-inactive');
            sortImportantButton.disabled = !anyImportantItemsPresent();
            sortDateButton.classList.remove('color-text-inactive');
            sortDateButton.disabled = !anyDateItemsPresent();
        }
    }

    function anyImportantItemsPresent() {
        return !!groupContainer.querySelector('.item button.color-important');
    }

    function anyDateItemsPresent() {
        return Array.from(groupContainer.querySelectorAll('.item input[type="date"]')).some(input => input.value);
    }

    groupContainer.addEventListener('change', (event) => {
        if (event.target.matches('.group input[type="checkbox"]') || event.target.matches('.item input[type="checkbox"]')) {
            updateClearButtonColor();
        } else if (event.target.matches('.item input[type="date"]')) {
            updateDueDateLabel(event.target);
            updateSortButtons();
        }
    });

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
            updateSortButtons();
            filterImportantItems();

            if (!groupContainer.querySelector('.item button.color-important')) {
                sortImportantButton.classList.remove('color-important');
                filterImportantItems();
                updateToolbarButtons();
            }
        }
    });

    sortImportantButton.addEventListener('click', () => {
        if (!sortImportantButton.classList.contains('color-text-inactive')) {
            sortImportantButton.classList.toggle('color-important');
            filterImportantItems();
            updateToolbarButtons();
        }
    });

    sortDateButton.addEventListener('click', () => {
        if (!sortDateButton.classList.contains('color-text-inactive')) {
            sortDateButton.classList.toggle('color-selection');
            filterDateItems();
            updateToolbarButtons();
        }
    });

    updateClearButtonColor();
    updateSortButtons();
    updateToolbarButtons();

    function renderGroup(group) {
        const template = document.getElementById('group-template').innerHTML;
        const compiledTemplate = Handlebars.compile(template);
        return compiledTemplate(group);
    }

    function renderItem(item, groupId) {
        const template = document.getElementById('item-template').innerHTML;
        const compiledTemplate = Handlebars.compile(template);
        return compiledTemplate({ ...item, groupId });
    }

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

    addGroupButton.addEventListener('click', async () => {
        const newGroup = await groupService.createGroup();
        const groupHTML = renderGroup(newGroup);
        document.getElementById('group-list').insertAdjacentHTML('beforeend', groupHTML);
        updateClearButtonColor();
        initializeGroupSortable();
        initializeItemSortable();
    });

    groupContainer.addEventListener('click', async (event) => {
        if (event.target.matches('.add-item')) {
            const groupId = event.target.getAttribute('data-group');
            const newItem = await itemService.createItem(groupId);
            const itemHTML = renderItem(newItem, groupId);
            document.getElementById(`item-list-${groupId}`).insertAdjacentHTML('beforeend', itemHTML);
            updateClearButtonColor();
            initializeItemSortable();
            updateSortButtons();
        }
    });

    clearButton.addEventListener('click', async () => {
        console.log('Clear button clicked');

        const checkedGroups = groupContainer.querySelectorAll('.item-group input[type="checkbox"]:checked');
        for (const checkbox of checkedGroups) {
            const group = checkbox.closest('.group');
            const groupId = group.getAttribute('data-id');
            const groupHeaderInput = group.querySelector('.label-heading');
            const hasNonEmptyItem = Array.from(group.querySelectorAll('.item input[type="text"]'))
                .some(input => input.value.trim() !== '');

            if (!hasNonEmptyItem && groupHeaderInput.value.trim() === '') {
                await groupService.deleteGroup(groupId);
                await itemService.deleteItemsByGroupId(groupId);
                group.remove();
            }
        }

        const checkedItems = groupContainer.querySelectorAll('.item > input[type="checkbox"]:checked');
        for (const checkbox of checkedItems) {
            const item = checkbox.closest('.item');
            const itemId = item.getAttribute('data-id');
            const dueDateElement = document.getElementById(`due-date-text-${item.getAttribute('data-group')}-${itemId}`);
            if (dueDateElement) {
                dueDateElement.remove();
            }
            await itemService.deleteItem(itemId);
            item.remove();
        }

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
                    const dueDateElement = document.getElementById(`due-date-text-${groupId}-${itemId}`);
                    if (dueDateElement) {
                        dueDateElement.remove();
                    }
                    await itemService.deleteItem(itemId);
                    item.remove();
                } else {
                    hasNonEmptyItem = true;
                }
            }

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
        updateSortButtons();
        filterImportantItems();
        filterDateItems();
    });

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

    async function updateGroupOrder(newOrder) {
        for (let group of newOrder) {
            await groupService.updateGroup(group.id, { order: group.order });
        }
    }

    async function updateItemGroupAndOrder(newOrder) {
        for (let item of newOrder) {
            await itemService.updateItem(item.id, { order: item.order, groupId: item.groupId });
        }
    }

    initializeGroupSortable();
    initializeItemSortable();
});
