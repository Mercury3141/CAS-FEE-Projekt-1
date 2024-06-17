import {
    createNewListGroup,
    createNewReminder,
    renderListGroups,
    renderReminders,
    loadListGroups,
    clearAllListGroups,
    toggleClearButtonState,
    toggleDateButtonState,
    saveState,
    filterRemindersByDate,
    makeEditable,
    updateGroupTitle,
    updateReminderText
} from './functions.js';
import { updateListGroup } from './noteService.js';

class ReminderApp {
    constructor() {
        this.groupIdCounter = 0;
        this.reminderIdCounter = 0;
        this.listGroups = [];
        this.saveState = saveState.bind(this);
    }

    async init() {
        this.toolbarNewGroupButton = document.querySelector('#toolbar-new-reminder');
        this.clearRemindersButton = document.querySelector('#clear-reminders');
        this.dateButton = document.querySelector('#sort-by-date');
        this.flexContainerElements = document.querySelector('#flex-container-elements');
        this.listGroupTemplate = document.querySelector('#list-group-template').innerHTML;
        this.reminderTemplate = document.querySelector('#reminder-template').innerHTML;
        this.compiledListGroupTemplate = Handlebars.compile(this.listGroupTemplate);
        this.compiledReminderTemplate = Handlebars.compile(this.reminderTemplate);

        this.toolbarNewGroupButton.addEventListener('click', () => this.createNewListGroup());
        this.clearRemindersButton.addEventListener('click', () => this.clearAllListGroups());
        this.dateButton.addEventListener('click', () => this.filterRemindersByDate());

        await this.loadListGroups();
        this.toggleDateButtonState();
    }

    async createNewListGroup() {
        if (document.querySelector('#sort-by-date').classList.contains('active')) {
            this.filterRemindersByDate(true);
        }
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

    toggleDateButtonState() {
        toggleDateButtonState.call(this);
    }

    filterRemindersByDate(turnOff = false) {
        filterRemindersByDate.call(this, turnOff);
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
                await updateListGroup(groupId, listGroup);
            });
        });

        const groupTitle = listGroupElement.querySelector('.group-title');
        groupTitle.addEventListener('click', () => {
            makeEditable(groupTitle, async (newTitle) => {
                await updateGroupTitle.call(this, groupId, newTitle);
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
                await updateListGroup(groupId, listGroup);
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
                await updateListGroup(groupId, listGroup);
            });
        });

        const dateInput = reminderElement.querySelector(`#date-${reminderId}`);
        dateInput.addEventListener('change', async () => {
            const listGroup = this.listGroups.find(group => group.id === groupId);
            const reminder = listGroup.reminders.find(rem => rem.id === reminderId);
            reminder.date = dateInput.value;
            await updateListGroup(groupId, listGroup);
        });

        dateInput.addEventListener('input', () => this.toggleDateButtonState());

        const reminderText = reminderElement.querySelector('.editable-label.text-list');
        reminderText.addEventListener('click', () => {
            makeEditable(reminderText, async (newText) => {
                await updateReminderText.call(this, groupId, reminderId, newText);
            });
        });
    }
}

export default ReminderApp;
