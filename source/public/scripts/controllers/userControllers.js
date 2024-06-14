import { getListGroups, saveListGroups, updateListGroup, deleteListGroup } from '../utils/noteService.js';

document.addEventListener('DOMContentLoaded', async () => {
    const toolbarNewButton = document.querySelector('#toolbar-new-reminder');
    const clearRemindersButton = document.querySelector('#clear-reminders');
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
        toggleClearButtonState();
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

        const checkboxes = listGroupElement.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', toggleClearButtonState);
        });
    };

    const loadListGroups = async () => {
        try {
            listGroups = await getListGroups();
            renderListGroups();
        } catch (error) {
            console.error('Error loading list groups:', error);
        }
    };

    const clearAllListGroups = async () => {
        try {
            listGroups = [];
            renderListGroups();
            await saveListGroups(listGroups);
        } catch (error) {
            console.error('Error clearing list groups:', error);
        }
    };

    const toggleClearButtonState = () => {
        const checkboxes = document.querySelectorAll('.list-group input[type="checkbox"], .reminder input[type="checkbox"]');
        const anyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
        if (anyChecked) {
            clearRemindersButton.classList.remove('inactive');
            clearRemindersButton.classList.add('color-caution');
        } else {
            clearRemindersButton.classList.remove('color-caution');
            clearRemindersButton.classList.add('inactive');
        }
    };

    toolbarNewButton.addEventListener('click', createNewListGroup);
    clearRemindersButton.addEventListener('click', clearAllListGroups);

    await loadListGroups();
});
