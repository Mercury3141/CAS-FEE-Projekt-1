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
        const compiledTemplate = Handlebars.compile(groupTemplate);
        const groupHTML = compiledTemplate(context);

        const groupList = document.getElementById('group-list');
        groupList.insertAdjacentHTML('beforeend', groupHTML);
    }

    groupContainer.addEventListener('click', (event) => {
        if (event.target && event.target.id === 'add-item') {
            const groupId = event.target.getAttribute('data-group');
            addItemToGroup(groupId);
        }
    });

    function addItemToGroup(groupId) {
        const groupElement = document.getElementById(`group-${groupId}`);
        const itemList = groupElement.querySelector(`ul`);
        const itemId = Date.now(); // Unique ID for the item

        const itemHTML = `
            <li class="item" aria-labelledby="item-name-input-${groupId}-${itemId}" data-id="${itemId}" data-group="${groupId}">
                <input type="checkbox" id="item-checkbox-${groupId}-${itemId}" title="Toggle Completed" aria-label="Toggle New Reminder" tabindex="0" data-id="${itemId}">
                <input class="label-item" id="reminder-item-${groupId}-${itemId}" type="text" placeholder="New Reminder" title="Enter Reminder Description" aria-label="New Reminder" data-id="${itemId}">
                <button class="margins-left-right" id="toggle-important" title="Toggle Importance" aria-pressed="false" aria-label="Toggle Importance" tabindex="0" data-id="${itemId}">!</button>
                <input class="date-input" type="date" id="item-date-${groupId}-${itemId}" name="item-date" title="Set Due Date" value="" aria-describedby="due-date-text-${groupId}-${itemId}" data-id="${itemId}">
            </li>
            <li class="label-due-date" id="due-date-text-${groupId}-${itemId}" style="display: none;">Due on</li>
        `;

        itemList.insertAdjacentHTML('beforeend', itemHTML);
    }
});
