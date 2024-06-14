import {getListGroups, saveListGroups, updateListGroup} from "./noteService";

async createNewListGroup() {
    try {
        const newListGroup = {
            id: this.groupIdCounter++,
            title: 'Group Title',
            reminders: []
        };
        this.listGroups.push(newListGroup);
        this.renderListGroups();
        await saveListGroups(this.listGroups);
    } catch (error) {
        console.error('Error creating new list group:', error);
    }
}

async createNewReminder(groupId) {
    try {
        const listGroup = this.listGroups.find(group => group.id === groupId);
        const newReminder = {
            id: this.reminderIdCounter++,
            text: 'New Reminder',
            date: '',
            important: false
        };
        listGroup.reminders.push(newReminder);
        this.renderListGroups();
        await updateListGroup(groupId, listGroup);
    } catch (error) {
        console.error('Error creating new reminder:', error);
    }
}

renderListGroups() {
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

renderReminders(group, remindersContainer) {
    remindersContainer.innerHTML = '';
    group.reminders.forEach(reminder => {
        const newReminderHtml = this.compiledReminderTemplate(reminder);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = newReminderHtml;
        const reminderElement = tempDiv.firstElementChild;
        remindersContainer.appendChild(reminderElement);
        this.addReminderEventListeners(reminderElement, group.id, reminder.id);
    });
}

const checkboxes = reminderElement.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => this.toggleClearButtonState());
});
}

async loadListGroups() {
    try {
        console.log('Attempting to fetch list groups...');
        this.listGroups = await getListGroups();
        console.log('List groups fetched successfully:', this.listGroups);
        this.renderListGroups();
    } catch (error) {
        console.error('Error loading list groups:', error);
    }
}

async clearAllListGroups() {
    try {
        this.listGroups = [];
        this.renderListGroups();
        await saveListGroups(this.listGroups);
    } catch (error) {
        console.error('Error clearing list groups:', error);
    }
}

toggleClearButtonState() {
    const checkboxes = document.querySelectorAll('.list-group input[type="checkbox"], .checkbox-container input[type="checkbox"]');
    const anyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
    if (anyChecked) {
        this.clearRemindersButton.classList.remove('inactive');
        this.clearRemindersButton.classList.add('color-caution');
    } else {
        this.clearRemindersButton.classList.remove('color-caution');
        this.clearRemindersButton.classList.add('inactive');
    }
}

new ReminderApp();