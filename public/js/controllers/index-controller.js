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
        const order = document.querySelectorAll('.group').length + 1;
        const newGroupHtml = groupTemplate({ id: newGroupId, order: order, checked: false, textContent: "New Group" });
        groupList.innerHTML += newGroupHtml;

        saveAllData();
    });

    groupList.addEventListener('click', function(event) {
        if (event.target.classList.contains('add-item')) {
            const groupId = event.target.dataset.group;
            const newItemId = itemIdCounter++;
            const newItemHtml = itemTemplate({
                id: newItemId,
                groupId: groupId,
                order: document.querySelectorAll(`#item-list-${groupId} .item`).length + 1,
                checked: false,
                textContent: "New Item",
                important: false,
                dueDate: null
            });
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
            const order = index + 1;
            const checkboxState = document.getElementById(`group-checkbox-${groupId}`).checked;
            const groupTitle = document.getElementById(`reminders-group-${groupId}`).value || "Untitled Group";

            // Debugging statement to track group data completeness
            console.log("Group Data", { groupId, order, checkboxState, groupTitle });

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
                const itemTitle = document.getElementById(`reminder-item-${groupId}-${itemId}`).value || "Untitled Item";
                const itemDueDate = document.getElementById(`item-date-${groupId}-${itemId}`).value;
                const itemImportant = document.getElementById(`toggle-important-${groupId}-${itemId}`).getAttribute('aria-pressed') === 'true';

                // Debugging statement to track item data completeness
                console.log("Item Data", { itemId, groupId, itemCheckboxState, itemTitle, itemDueDate, itemImportant });

                data.items.push({
                    id: itemId,
                    groupId: groupId,
                    order: itemIndex + 1,
                    checked: itemCheckboxState,
                    textContent: itemTitle,
                    important: itemImportant,
                    dueDate: itemDueDate || null
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

    function loadData() {
        fetch('/api/groups')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Loaded Data:", data);
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

    groupList.addEventListener('change', function(event) {
        const target = event.target;
        if (target.classList.contains('label-heading') || target.type === 'checkbox' || target.type === 'text' || target.type === 'date') {
            saveAllData();
        }
    });
});
