import { createNewListGroup, createNewReminder, renderListGroups, renderReminders, loadListGroups, clearAllListGroups, toggleClearButtonState, saveState } from './functions.js';
import { updateListGroup } from './noteService.js';

class ReminderApp {
    constructor() {
        this.groupIdCounter = 0;
        this.reminderIdCounter = 0;
        this.listGroups = [];
    }

    async init() {
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
    }

    async createNewListGroup() {
        await createNewListGroup.call(this);
    }

    async createNewReminder(groupId) {
        await createNewReminder.call(this, groupId);
    }

    renderListGroups() {
        renderListGroups.call(this);
    }

    renderReminders(group, remindersContainer) {
        renderReminders.call(this, group, remindersContainer);
    }

    async loadListGroups() {
        await loadListGroups.call(this);
    }

    async clearAllListGroups() {
        await clearAllListGroups.call(this);
    }

    toggleClearButtonState() {
        toggleClearButtonState.call(this);
    }

    addListGroupEventListeners(listGroupElement, groupId) {
        const newReminderButton = listGroupElement.querySelector('[data-action="create-reminder"]');
        newReminderButton.addEventListener('click', () => this.createNewReminder(groupId));

        const checkboxes = listGroupElement.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', async () => {
                const listGroup = this.listGroups.find(group => group.id === groupId);
                const reminderId = parseInt(checkbox.closest('.checkbox-container').dataset.id, 10);
                const reminder = listGroup.reminders.find(rem => rem.id === reminderId);
                reminder.checked = checkbox.checked;
                this.toggleClearButtonState();
                await updateListGroup(groupId, listGroup); // Save the state immediately
            });
        });
    }

    addReminderEventListeners(reminderElement, groupId, reminderId) {
        const toggleImportantButton = reminderElement.querySelector('[data-action="toggle-important"]');
        toggleImportantButton.addEventListener('click', async () => {
            try {
                const listGroup = this.listGroups.find(group => group.id === groupId);
                const reminder = listGroup.reminders.find(rem => rem.id === reminderId);
                reminder.important = !reminder.important;
                toggleImportantButton.innerText = reminder.important ? '!!' : '!';
                await updateListGroup(groupId, listGroup); // Save the state immediately
            } catch (error) {
                console.error('Error toggling important state:', error);
            }
        });

        const checkboxes = reminderElement.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', async () => {
                const listGroup = this.listGroups.find(group => group.id === groupId);
                const reminder = listGroup.reminders.find(rem => rem.id === reminderId);
                reminder.checked = checkbox.checked;
                this.toggleClearButtonState();
                await updateListGroup(groupId, listGroup); // Save the state immediately
            });
        });

        const dateInput = reminderElement.querySelector(`#date-${reminderId}`);
        dateInput.addEventListener('change', async () => {
            const listGroup = this.listGroups.find(group => group.id === groupId);
            const reminder = listGroup.reminders.find(rem => rem.id === reminderId);
            reminder.date = dateInput.value;
            await updateListGroup(groupId, listGroup); // Save the state immediately
        });
    }
}

export default ReminderApp;
