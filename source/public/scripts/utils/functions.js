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
    this.toggleDateButtonState();
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

        reminderElement.querySelector(`#checkbox-${reminder.id}`).checked = reminder.checked;
        reminderElement.querySelector(`#date-${reminder.id}`).value = reminder.date;
        reminderElement.querySelector(`#button-${reminder.id}`).innerText = reminder.important ? '!!' : '!';

        const dateInput = reminderElement.querySelector(`#date-${reminder.id}`);
        dateInput.addEventListener('input', () => this.toggleDateButtonState());
    });
}

export async function loadListGroups() {
    try {
        this.listGroups = await getListGroups();
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
    const clearButton = document.querySelector('#clear-reminders');
    if (anyChecked) {
        clearButton.classList.remove('inactive');
        clearButton.classList.add('color-caution');
    } else {
        clearButton.classList.remove('color-caution');
        clearButton.classList.add('inactive');
    }
}

export function toggleDateButtonState() {
    const dateInputs = document.querySelectorAll('.date-input');
    const anyDateEntered = Array.from(dateInputs).some(dateInput => dateInput.value !== '');
    const dateButton = document.querySelector('#sort-by-date');
    if (anyDateEntered) {
        dateButton.classList.remove('inactive');
        dateButton.classList.add('color-main');
    } else {
        dateButton.classList.remove('color-main');
        dateButton.classList.add('inactive');
    }
}

export function filterRemindersByDate() {
    const dateButton = document.querySelector('#sort-by-date');
    const isActive = dateButton.classList.contains('active');
    this.listGroups.forEach(group => {
        const remindersContainer = document.querySelector(`#reminders-container-${group.id}`);
        group.reminders.forEach(reminder => {
            const reminderElement = remindersContainer.querySelector(`[data-id="${reminder.id}"]`);
            if (isActive) {
                reminderElement.style.display = 'block';
            } else {
                reminderElement.style.display = reminder.date ? 'block' : 'none';
            }
        });
    });
    dateButton.classList.toggle('active');
}
