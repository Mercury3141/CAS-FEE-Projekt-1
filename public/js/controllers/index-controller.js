document.addEventListener('DOMContentLoaded', function() {
    const groupList = document.getElementById('group-list');
    const addGroupButton = document.getElementById('add-group');
    const groupTemplateSource = document.getElementById('group-template').innerHTML;
    const itemTemplateSource = document.getElementById('item-template').innerHTML;
    const groupTemplate = Handlebars.compile(groupTemplateSource);
    const itemTemplate = Handlebars.compile(itemTemplateSource);
    let groupIdCounter = Date.now();
    let itemIdCounter = Date.now();

    addGroupButton.addEventListener('click', function() {
        const newGroupId = groupIdCounter++;
        const order = document.querySelectorAll('.group').length + 1; // Order is the sequence of creation
        const newGroupHtml = groupTemplate({ id: newGroupId, order: order });
        groupList.innerHTML += newGroupHtml;

        saveAllData();
    });

    groupList.addEventListener('click', function(event) {
        if (event.target.classList.contains('add-item')) {
            const groupId = event.target.dataset.group;
            const newItemId = itemIdCounter++;
            const newItemHtml = itemTemplate({ id: newItemId, groupId: groupId });
            document.getElementById(`item-list-${groupId}`).innerHTML += newItemHtml;

            saveAllData();
        }
    });

    function saveAllData() {
        const data = {
            groups: [],
            items: []
        };

        const groups = document.querySelectorAll('.group');
        groups.forEach((groupElement, index) => {
            const groupId = groupElement.dataset.id;
            const order = index + 1; // Order based on position in the list
            const checkboxState = document.getElementById(`group-checkbox-${groupId}`).checked;
            const groupTitle = document.getElementById(`reminders-group-${groupId}`).value;

            data.groups.push({
                id: groupId,
                order: order,
                checked: checkboxState,
                textContent: groupTitle
            });

            const items = groupElement.querySelectorAll('.item');
            items.forEach((itemElement, itemIndex) => {
                const itemId = itemElement.dataset.id;
                const itemCheckboxState = document.getElementById(`item-checkbox-${groupId}-${itemId}`).checked;
                const itemTitle = document.getElementById(`reminder-item-${groupId}-${itemId}`).value;
                const itemDueDate = document.getElementById(`item-date-${groupId}-${itemId}`).value;
                const itemImportant = document.getElementById(`toggle-important-${groupId}-${itemId}`).getAttribute('aria-pressed') === 'true';

                data.items.push({
                    id: itemId,
                    groupId: groupId,
                    order: itemIndex + 1,
                    checked: itemCheckboxState,
                    textContent: itemTitle,
                    important: itemImportant,
                    dueDate: itemDueDate
                });
            });
        });

        fetch('/api/groups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Data saved:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Load data from the server when the page loads
    function loadData() {
        fetch('/api/groups')
            .then(response => response.json())
            .then(data => {
                data.groups = data.groups || [];
                data.items = data.items || [];
                renderGroups(data.groups);
                renderItems(data.items);
            })
            .catch(error => {
                console.error('Error loading data:', error);
            });
    }

    function renderGroups(groups) {
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

    groupList.addEventListener('change', function(event) {
        const target = event.target;
        if (target.classList.contains('label-heading') || target.type === 'checkbox' || target.type === 'text' || target.type === 'date') {
            saveAllData();
        }
    });
});
