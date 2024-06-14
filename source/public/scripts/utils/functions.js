import { getListGroups, saveListGroups, updateListGroup } from './noteService.js';

export async function createNewListGroup() {
    try {
        const newListGroup = {
            id: this.groupIdCounter++,
            title: 'Group Title',
            reminders: []
        };
        this.listGroups.push(newListGroup);
        await this.saveState();
        this.renderListGroups();
    } catch (error) {
        console.error('Error creating new list group:', error);
    }
}

export async function createNewReminder(groupId) {
    try {
        const listGroup = this.listGroups.find(group => group.id === groupId);
        const newReminder = {
            id: this.reminderIdCounter++,
            text: 'New Reminder',
            date: '',
            important: false,
            checked: false
        };
        listGroup.reminders.push(newReminder);
        await this.saveState();
        this.renderListGroups();
    } catch (error) {
        console.error('Error creating new reminder:', error);
    }
}

export async function saveState() {
    try {
        await saveListGroups(this.listGroups);
    } catch (error) {
        console.error('Error saving list groups:', error);
    }
}

export function renderListGroups() {
    this.flexContainerElements.innerHTML = '';
    this.listGroups.forEach(group => {
        const newListGroupHtml = this.compiledListGroupTemplate(group);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = newListGroupHtml;
        const listGroupElement = tempDiv.firstElementChild;
        this.flexContainerElements.appendChild(listGroupElement);
        this.renderReminders(group, listGroupElement.querySelector('.reminders-container'));
        this.addListGroupEventListeners(listGroupElement, group.id);
    });
    this.toggleClearButtonState();
}

export function renderReminders(group, remindersContainer) {
    remindersContainer.innerHTML = '';
    group.reminders.forEach(reminder => {
        const newReminderHtml = this.compiledReminderTemplate(reminder);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = newReminderHtml;
        const reminderElement = tempDiv.firstElementChild;
        remindersContainer.appendChild(reminderElement);
        this.addReminderEventListeners(reminderElement, group.id, reminder.id);

        // Restore the state
        reminderElement.querySelector(`#checkbox-${reminder.id}`).checked = reminder.checked;
        reminderElement.querySelector(`#date-${reminder.id}`).value = reminder.date;
        reminderElement.querySelector(`#button-${reminder.id}`).innerText = reminder.important ? '!!' : '!';
    });
}

export async function loadListGroups() {
    try {
        console.log('Attempting to fetch list groups...');
        this.listGroups = await getListGroups();
        console.log('List groups fetched successfully:', this.listGroups);
        this.renderListGroups();
    } catch (error) {
        console.error('Error loading list groups:', error);
    }
}

export async function clearAllListGroups() {
    try {
        this.listGroups = [];
        await this.saveState();
        this.renderListGroups();
    } catch (error) {
        console.error('Error clearing list groups:', error);
    }
}

export function toggleClearButtonState() {
    const checkboxes = document.querySelectorAll('.list-group input[type="checkbox"], .checkbox-container input[type="checkbox"]');
    const anyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
    switch (anyChecked) {
        case true:
            this.clearRemindersButton.classList.remove('inactive');
            this.clearRemindersButton.classList.add('color-caution');
            break;
        case false:
            this.clearRemindersButton.classList.remove('color-caution');
            this.clearRemindersButton.classList.add('inactive');
            break;
        default:
            console.error('Unexpected checkbox state');
            break;
    }
}
