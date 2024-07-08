import itemService from '../services/item-service.js';

document.addEventListener('DOMContentLoaded', () => {
    const addGroupButton = document.querySelector("#add-group");
    const mainContainer = document.querySelector("main.flex-container-scroll");
    const groupTemplateSource = document.querySelector("#group-template").innerHTML;
    const groupTemplate = Handlebars.compile(groupTemplateSource);

    const createNewGroup = async () => {
        const groups = document.querySelectorAll('.group');
        const newGroupId = groups.length;

        const groupData = {
            id: newGroupId,
            order: newGroupId,
            itemId: newGroupId * 100 + 1
        };

        try {
            const newGroup = await itemService.createGroup(groupData);

            const newGroupHTML = groupTemplate({
                id: newGroup.id,
                order: newGroup.order,
                itemId: newGroup.itemId
            });

            mainContainer.insertAdjacentHTML('beforeend', newGroupHTML);

            const newDateInput = document.querySelector(`#item-date-${newGroup.id}-0`);
            const dueDateText = document.querySelector(`#due-date-text-${newGroup.id}-0`);

            newDateInput.addEventListener('input', () => {
                if (newDateInput.value) {
                    dueDateText.style.display = 'block';
                    dueDateText.textContent = `Due on ${newDateInput.value}`;
                } else {
                    dueDateText.style.display = 'none';
                }
            });
        } catch (error) {
            console.error('Error creating new group:', error);
        }
    };

    addGroupButton.addEventListener('click', (event) => {
        event.preventDefault();
        createNewGroup();
    });
});

