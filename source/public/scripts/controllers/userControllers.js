import { getListGroups, saveListGroups, updateListGroup } from '../utils/noteService.js';

    async init() {
        document.addEventListener('DOMContentLoaded', async () => {
            this.toolbarNewGroupButton = document.querySelector('#toolbar-new-reminder');
            this.clearRemindersButton = document.querySelector('#clear-reminders');
            this.flexContainerElements = document.querySelector('#flex-container-elements');
            this.listGroupTemplate = document.querySelector('#list-group-template').innerHTML;
            this.reminderTemplate = document.querySelector('#reminder-template').innerHTML;
            this.compiledListGroupTemplate = Handlebars.compile(this.listGroupTemplate);
            this.compiledReminderTemplate = Handlebars.compile(this.reminderTemplate);

            this.toolbarNewGroupButton.addEventListener('click', () => this.createNewListGroup());
            this.clearRemindersButton.addEventListener('click', () => this.clearAllListGroups());

            await this.loadListGroups();
        });
    }

    addListGroupEventListeners(listGroupElement, groupId) {
        const newReminderButton = listGroupElement.querySelector('[data-action="create-reminder"]');
        newReminderButton.addEventListener('click', () => this.createNewReminder(groupId));

        const checkboxes = listGroupElement.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.toggleClearButtonState());
        });
    }

    addReminderEventListeners(reminderElement, groupId, reminderId)
{
    const toggleImportantButton = reminderElement.querySelector('[data-action="toggle-important"]');
    toggleImportantButton.addEventListener('click', async () => {
        try {
            const listGroup = this.listGroups.find(group => group.id === groupId);
            const reminder = listGroup.reminders.find(rem => rem.id === reminderId);
            reminder.important = !reminder.important;
            toggleImportantButton.innerText = reminder.important ? '!!' : '!';
            await updateListGroup(groupId, listGroup);
        } catch (error) {
            console.error('Error toggling important state:', error);
        }
    });
}
