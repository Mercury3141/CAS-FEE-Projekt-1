import { getListGroups, saveListGroups, updateListGroup, deleteListGroup } from '../utils/noteService.js';

document.addEventListener('DOMContentLoaded', async () => {
    const toolbarNewButton = document.querySelector('#toolbar-new-reminder');
    const flexContainerElements = document.querySelector('#flex-container-elements');
    const listGroupTemplate = document.querySelector('#list-group-template').innerHTML;
    const compiledListGroupTemplate = Handlebars.compile(listGroupTemplate);

    let groupIdCounter = 0;
    let listGroups = [];

    const createNewListGroup = async () => {
        try {
            const newListGroup = {
                id: groupIdCounter++,
                title: 'Group Title',
                reminders: []
            };
            listGroups.push(newListGroup);
            renderListGroups();
            await saveListGroups(listGroups);
        } catch (error) {
            console.error('Error creating new list group:', error);
        }
    };

    const renderListGroups = () => {
        flexContainerElements.innerHTML = '';
        listGroups.forEach(group => {
            const newListGroupHtml = compiledListGroupTemplate(group);
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = newListGroupHtml;
            const listGroupElement = tempDiv.firstElementChild;
            flexContainerElements.appendChild(listGroupElement);
            addListGroupEventListeners(listGroupElement, group.id);
        });
    };

    const addListGroupEventListeners = (listGroupElement, groupId) => {
        const newReminderButton = listGroupElement.querySelector('[data-action="create-reminder"]');
        const onNewReminderClick = async () => {
            try {
                const listGroup = listGroups.find(group => group.id === groupId);
                listGroup.reminders.push({ text: 'New Reminder' });
                await updateListGroup(groupId, listGroup);
                renderListGroups();
            } catch (error) {
                console.error('Error creating new reminder:', error);
            }
        };
        newReminderButton.addEventListener('click', onNewReminderClick);

        const deleteButton = listGroupElement.querySelector('[data-action="delete-group"]');
        if (deleteButton) {
            const onDeleteGroupClick = async () => {
                try {
                    listGroups = listGroups.filter(group => group.id !== groupId);
                    await deleteListGroup(groupId);
                    renderListGroups();
                } catch (error) {
                    console.error('Error deleting list group:', error);
                }
            };
            deleteButton.addEventListener('click', onDeleteGroupClick);
        }
    };

    const loadListGroups = async () => {
        try {
            listGroups = await getListGroups();
            renderListGroups();
        } catch (error) {
            console.error('Error loading list groups:', error);
        }
    };

    toolbarNewButton.addEventListener('click', createNewListGroup);

    await loadListGroups();
});
