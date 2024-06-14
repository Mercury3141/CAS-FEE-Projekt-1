import { getListGroups, saveListGroups, updateListGroup, deleteListGroup } from '../utils/noteService.js';

document.addEventListener('DOMContentLoaded', () => {
    const toolbarNewButton = document.querySelector('#toolbar-new-reminder');
    const flexContainerElements = document.querySelector('#flex-container-elements');
    const listGroupTemplate = document.querySelector('#list-group-template').innerHTML;
    const compiledListGroupTemplate = Handlebars.compile(listGroupTemplate);

    let groupIdCounter = 0;
    let listGroups = [];

    const createNewListGroup = async () => {
        const newListGroup = {
            id: groupIdCounter++,
            title: 'Group Title',
            reminders: []
        };
        listGroups.push(newListGroup);
        renderListGroups();
        await saveListGroups(listGroups);
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

            const listGroup = listGroups.find(group => group.id === groupId);
            listGroup.reminders.push({ text: 'New Reminder' });
            await updateListGroup(groupId, listGroup);
            renderListGroups();
        };
        newReminderButton.addEventListener('click', onNewReminderClick);
    };

    const loadListGroups = async () => {
        listGroups = await getListGroups();
        renderListGroups();
    };

    toolbarNewButton.addEventListener('click', createNewListGroup);

    loadListGroups();
});
