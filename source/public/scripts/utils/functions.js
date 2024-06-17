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
        reminderElement.querySelector(`#label-${reminder.id}`).innerText = reminder.text;
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
    } else {
        dateButton.classList.add('inactive');
    }
}

export function filterRemindersByDate(turnOff = false) {
    const dateButton = document.querySelector('#sort-by-date');
    const isActive = dateButton.classList.contains('active');

    if (isActive || turnOff) {
        this.renderListGroups();
        document.querySelectorAll('.selected-list-group').forEach(el => el.classList.remove('selected-list-group'));
        dateButton.classList.remove('active');
    } else {
        const tempGroup = {
            id: 'temp',
            title: 'Sorted by Date',
            reminders: []
        };

        this.listGroups.forEach(group => {
            group.reminders.forEach(reminder => {
                if (reminder.date) {
                    tempGroup.reminders.push(reminder);
                }
            });
        });

            // Sort reminders by date (ascending)
        tempGroup.reminders.sort((a, b) => new Date(a.date) - new Date(b.date));

        this.flexContainerElements.innerHTML = '';
        const newListGroupHtml = this.compiledListGroupTemplate(tempGroup);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = newListGroupHtml;
        const listGroupElement = tempDiv.firstElementChild;
        listGroupElement.classList.add('selected-list-group');
        this.flexContainerElements.appendChild(listGroupElement);
        this.renderReminders(tempGroup, listGroupElement.querySelector('.reminders-container'));
        dateButton.classList.add('active');
    }
}


export function normalizePaste(event) {
    event.preventDefault();
    const text = (event.clipboardData || window.clipboardData).getData('text');

    const selection = window.getSelection();
    if (!selection.rangeCount) return false;
    selection.deleteFromDocument();

    const range = selection.getRangeAt(0);
    range.insertNode(document.createTextNode(text));

    // Merge text nodes if necessary
    range.commonAncestorContainer.normalize();
}

export function makeEditable(labelElement, saveCallback) {
    labelElement.contentEditable = 'true';
    labelElement.focus();

    const saveChanges = () => {
        labelElement.contentEditable = 'false';
        saveCallback(labelElement.innerText);
        document.removeEventListener('click', handleClickOutside);
        labelElement.removeEventListener('paste', handlePaste);
    };

    const handleClickOutside = (event) => {
        if (!labelElement.contains(event.target)) {
            saveChanges();
        }
    };

    const handlePaste = (event) => {
        normalizePaste(event);
    };

    labelElement.addEventListener('paste', handlePaste);
    document.addEventListener('click', handleClickOutside);
}

export async function updateGroupTitle(groupId, newTitle) {
    try {
        const listGroup = this.listGroups.find(group => group.id === groupId);
        listGroup.title = newTitle;
        await updateListGroup(groupId, listGroup);
    } catch (error) {
        console.error('Error updating group title:', error);
    }
}

export async function updateReminderText(groupId, reminderId, newText) {
    try {
        const listGroup = this.listGroups.find(group => group.id === groupId);
        const reminder = listGroup.reminders.find(rem => rem.id === reminderId);
        reminder.text = newText;
        await updateListGroup(groupId, listGroup);
    } catch (error) {
        console.error('Error updating reminder text:', error);
    }
}
