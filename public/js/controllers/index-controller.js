document.addEventListener('DOMContentLoaded', function() {
    const groupList = document.getElementById('group-list');
    const addGroupButton = document.getElementById('add-group');
    const groupTemplateSource = document.getElementById('group-template').innerHTML;
    const itemTemplateSource = document.getElementById('item-template').innerHTML;
    const groupTemplate = Handlebars.compile(groupTemplateSource);
    const itemTemplate = Handlebars.compile(itemTemplateSource);
    let groupIdCounter = 0;
    let itemIdCounter = 0;

    addGroupButton.addEventListener('click', function() {
        const newGroupId = `group-${groupIdCounter++}`;
        const order = groupIdCounter; // Assuming order is the sequence of creation
        const newGroupHtml = groupTemplate({ id: newGroupId, order: order });
        groupList.innerHTML += newGroupHtml;

        saveAllGroupsData();
    });

    groupList.addEventListener('click', function(event) {
        if (event.target.classList.contains('add-item')) {
            const groupId = event.target.dataset.group;
            const newItemId = `item-${itemIdCounter++}`;
            const newItemHtml = itemTemplate({ id: newItemId, groupId: groupId });
            document.getElementById(`item-list-${groupId}`).innerHTML += newItemHtml;

            saveAllGroupsData();
        }
    });

    function saveAllGroupsData() {
        const groupsData = [];
        const groups = document.querySelectorAll('.group');
        groups.forEach((groupElement, index) => {
            const groupId = groupElement.dataset.id;
            const order = index + 1; // Order based on position in the list
            const checkboxState = document.getElementById(`group-checkbox-${groupId}`).checked;
            const groupTitle = document.getElementById(`reminders-group-${groupId}`).value;

            const itemsData = [];
            const items = groupElement.querySelectorAll('.item');
            items.forEach(itemElement => {
                const itemId = itemElement.dataset.id;
                const itemCheckboxState = document.getElementById(`item-checkbox-${groupId}-${itemId}`).checked;
                const itemTitle = document.getElementById(`reminder-item-${groupId}-${itemId}`).value;
                const itemDueDate = document.getElementById(`item-date-${groupId}-${itemId}`).value;

                itemsData.push({
                    id: itemId,
                    checkboxState: itemCheckboxState,
                    title: itemTitle,
                    dueDate: itemDueDate
                });
            });

            groupsData.push({
                id: groupId,
                order: order,
                checkboxState: checkboxState,
                groupTitle: groupTitle,
                items: itemsData
            });
        });

        fetch('/api/groups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(groupsData)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Group data saved:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Optionally, you could add event listeners to save data when the checkbox or text input changes
    groupList.addEventListener('change', function(event) {
        const target = event.target;
        if (target.classList.contains('label-heading') || target.type === 'checkbox' || target.type === 'text' || target.type === 'date') {
            saveAllGroupsData();
        }
    });
});
