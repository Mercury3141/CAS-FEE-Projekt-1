"use strict";

document.addEventListener('DOMContentLoaded', () => {
    new ReminderManager(document.getElementById('flex-container-elements'));
});

class ReminderManager {
    constructor(containerElement) {
        this.containerElement = containerElement;
        this.reminderCounter = 0;
        this.groupCounter = 0;
        this.showingImportant = false;
        this.sortedByDate = false;
        this.originalState = null;
        this.currentState = null;
        this.tempDateGroup = null;
        this.importantColor = getComputedStyle(document.documentElement).getPropertyValue('--important-color').trim();
        this.clearRemindersButton = document.getElementById('clear-reminders');
        this.showImportantButton = document.getElementById('show-important');
        this.sortByDateButton = document.getElementById('sort-by-date');
        this.registerEventListeners();
        this.loadReminders();
        this.updateClearRemindersButtonState();
        this.updateFilterAndSortButtonState();
    }

    registerEventListeners() {
        this.documentClickHandler = (event) => {
            if (event.target.classList.contains('editable-label')) {
                this.makeLabelEditable(event.target);
            } else {
                this.confirmLabelChanges();
            }
        };

        this.newReminderHandler = () => {
            this.cancelFilters();
            this.createListGroup();
            this.updateFilterAndSortButtonState();
        };

        this.clearRemindersHandler = () => {
            this.clearReminders();
            this.updateFilterAndSortButtonState();
        };

        this.showImportantHandler = (event) => {
            if (!event.target.classList.contains('inactive')) {
                this.toggleButtonTextColor(event.target);
                this.filterImportantReminders();
            }
        };

        this.sortByDateHandler = () => {
            if (!this.sortByDateButton.classList.contains('inactive')) {
                this.toggleSortByDate();
            }
        };

        document.addEventListener('click', this.documentClickHandler);
        document.getElementById('toolbar-new-reminder').addEventListener('click', this.newReminderHandler);
        this.clearRemindersButton.addEventListener('click', this.clearRemindersHandler);
        this.showImportantButton.addEventListener('click', this.showImportantHandler);
        this.sortByDateButton.addEventListener('click', this.sortByDateHandler);

        this.containerElement.addEventListener('click', (event) => {
            const listGroup = event.target.closest('.list-group');
            if (event.target.dataset.action === 'create-reminder' && listGroup) {
                this.createReminder(listGroup, this.reminderCounter);
                this.reminderCounter++;
                this.updateFilterAndSortButtonState();
            }
        });

        this.containerElement.addEventListener('change', (event) => {
            if (event.target.matches('.list-group-header input[type="checkbox"]')) {
                this.toggleGroupCheckboxes(event.target);
            }
            if (event.target.matches('.checkbox-container input[type="checkbox"]')) {
                this.updateClearRemindersButtonState();
            }
            if (event.target.matches('.date-input')) {
                const reminderElement = event.target.closest('.checkbox-container');
                reminderElement.dataset.hasDate = event.target.value ? 'true' : 'false';
                this.saveReminders();
                this.updateFilterAndSortButtonState();
            }
        });

        this.containerElement.addEventListener('input', (event) => {
            if (event.target.classList.contains('editable-label')) {
                this.updateGreyedOutState(event.target);
            }
        });

        this.containerElement.addEventListener('keydown', (event) => {
            if (event.target.classList.contains('editable-label') && event.key === 'Enter') {
                event.preventDefault();
                this.confirmLabelChanges();
            }
        });
    }

    cancelFilters() {
        if (this.showingImportant) {
            this.toggleButtonTextColor(this.showImportantButton);
            this.showingImportant = false;
        }
        if (this.sortedByDate) {
            this.toggleSortByDate();
            this.sortedByDate = false;
        }
        this.restoreOriginalState();
    }

    toggleButtonTextColor(button) {
        button.style.color = button.style.color === this.importantColor ? '' : this.importantColor;
    }

    updateClearRemindersButtonState() {
        const anyChecked = this.containerElement.querySelector('.checkbox-container input[type="checkbox"]:checked') ||
            this.containerElement.querySelector('.list-group-header input[type="checkbox"]:checked');
        const anyGreyedOut = this.containerElement.querySelector('.editable-label.greyed-out');

        this.clearRemindersButton.classList.toggle('inactive', !(anyChecked || anyGreyedOut));
        this.clearRemindersButton.classList.toggle('active', anyChecked || anyGreyedOut);
    }

    updateFilterAndSortButtonState() {
        const anyImportantReminders = this.checkForImportantReminders();
        const anyRemindersWithDates = this.checkForRemindersWithDates();

        this.showImportantButton.classList.toggle('inactive', !anyImportantReminders);
        this.sortByDateButton.classList.toggle('inactive', !anyRemindersWithDates);
    }

    checkForImportantReminders() {
        return !!this.containerElement.querySelector(`.checkbox-container button[style*="color: ${this.importantColor}"]`);
    }

    checkForRemindersWithDates() {
        return !!this.containerElement.querySelector('.checkbox-container[data-has-date="true"]');
    }

    filterImportantReminders() {
        this.showingImportant = !this.showingImportant;
        const listGroups = this.containerElement.querySelectorAll('.list-group');
        listGroups.forEach(listGroup => {
            const reminders = listGroup.querySelectorAll('.checkbox-container');
            reminders.forEach(reminder => {
                const importantButton = reminder.querySelector('button');
                reminder.style.display = (this.showingImportant && importantButton.textContent !== '!!') ? 'none' : '';
            });
        });
    }

    toggleSortByDate() {
        this.sortedByDate = !this.sortedByDate;
        if (this.sortedByDate) {
            this.collectRemindersWithDates();
        } else {
            this.restoreRemindersToOriginalPositions();
        }
        this.saveReminders();
    }

    collectRemindersWithDates() {
        const dateGroup = {
            title: "Reminders with Dates",
            checked: false,
            reminders: []
        };

        this.currentState.reminders.forEach(group => {
            group.reminders = group.reminders.filter(reminder => {
                if (reminder.date) {
                    dateGroup.reminders.push(reminder);
                    return false;
                }
                return true;
            });
        });

        this.tempDateGroup = dateGroup;
        this.currentState.reminders.unshift(dateGroup);
        this.renderReminders();
    }

    restoreRemindersToOriginalPositions() {
        if (this.tempDateGroup) {
            this.tempDateGroup.reminders.forEach(reminder => {
                this.currentState.reminders.some(group => {
                    if (group.title !== "Reminders with Dates") {
                        group.reminders.push(reminder);
                        return true;
                    }
                    return false;
                });
            });
            this.currentState.reminders = this.currentState.reminders.filter(group => group.title !== "Reminders with Dates");
            this.tempDateGroup = null;
            this.renderReminders();
        }
    }

    renderReminders() {
        this.containerElement.innerHTML = '';
        this.currentState.reminders.forEach((group, groupIndex) => {
            const newListGroupHtml = Handlebars.compile(document.getElementById('list-group-template').innerHTML)({ id: groupIndex });
            this.containerElement.insertAdjacentHTML('beforeend', newListGroupHtml);
            const newListGroup = this.containerElement.querySelector(`#list-group-${groupIndex}`);
            newListGroup.querySelector('.group-title').textContent = group.title;
            newListGroup.querySelector('.list-group-header input[type="checkbox"]').checked = group.checked;

            group.reminders.forEach((reminder, reminderIndex) => {
                const newReminderHtml = Handlebars.compile(document.getElementById('reminder-template').innerHTML)({ id: reminderIndex });
                newListGroup.querySelector('.reminders-container').insertAdjacentHTML('beforeend', newReminderHtml);
                const newReminder = newListGroup.querySelector(`#label-${reminderIndex}`);
                newReminder.textContent = reminder.text;
                newReminder.classList.toggle('greyed-out', !reminder.text || reminder.text === 'New Reminder');
                newListGroup.querySelector(`#checkbox-${reminderIndex}`).checked = reminder.checked;
                const importantButton = newListGroup.querySelector(`#button-${reminderIndex}`);
                if (reminder.important) {
                    importantButton.style.color = this.importantColor;
                    importantButton.textContent = '!!';
                }
                newListGroup.querySelector(`#date-${reminderIndex}`).value = reminder.date;

                this.setupImportantCheckboxListener(reminderIndex);
                const reminderElement = newListGroup.querySelector(`.checkbox-container[data-id="${reminderIndex}"]`);
                reminderElement.dataset.hasDate = reminder.date ? 'true' : 'false';
            });
        });

        if (this.showingImportant) {
            this.filterImportantReminders();
        }

        if (this.sortedByDate) {
            this.toggleSortByDate();
        }

        this.updateClearRemindersButtonState();
        this.updateFilterAndSortButtonState();
        this.reattachImportantListeners();
    }

    toggleTextColorAndLabel(button) {
        button.style.color = button.style.color === this.importantColor ? '' : this.importantColor;
        button.textContent = button.textContent === '!!' ? '!' : '!!';
        this.updateFilterAndSortButtonState();
        this.saveReminders();
    }

    toggleGroupCheckboxes(groupCheckbox) {
        const listGroup = groupCheckbox.closest('.list-group');
        const checkboxes = listGroup.querySelectorAll('.reminders-container .checkbox-container input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = groupCheckbox.checked;
            const label = checkbox.nextElementSibling;
            label.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
        });

        const groupTitle = listGroup.querySelector('.group-title');
        groupTitle.style.textDecoration = groupCheckbox.checked ? 'line-through' : 'none';

        this.updateClearRemindersButtonState();
        this.updateFilterAndSortButtonState();
        this.saveReminders();
    }

    createListGroup() {
        const newListGroupHtml = Handlebars.compile(document.getElementById('list-group-template').innerHTML)({ id: this.groupCounter });
        this.containerElement.insertAdjacentHTML('afterbegin', newListGroupHtml);
        this.groupCounter++;
        const newListGroup = this.containerElement.querySelector(`#list-group-${this.groupCounter - 1} .group-title`);
        newListGroup.classList.add('greyed-out');
        this.saveReminders();
    }

    createReminder(listGroup, id) {
        const newReminderHtml = Handlebars.compile(document.getElementById('reminder-template').innerHTML)({ id });
        listGroup.querySelector('.reminders-container').insertAdjacentHTML('beforeend', newReminderHtml);

        this.setupImportantCheckboxListener(id);
        this.setupCheckboxListener(id);
        this.updateClearRemindersButtonState();
        this.updateFilterAndSortButtonState();

        const newReminder = listGroup.querySelector(`#label-${id}`);
        newReminder.classList.add('greyed-out');

        const dateInput = listGroup.querySelector(`#date-${id}`);
        dateInput.classList.add('date-input');

        const reminderElement = listGroup.querySelector(`.checkbox-container[data-id="${id}"]`);
        reminderElement.dataset.hasDate = 'false';

        this.makeLabelEditable(newReminder);
        this.saveReminders();
    }

    setupImportantCheckboxListener(id) {
        const importantButton = document.getElementById(`button-${id}`);
        if (importantButton) {
            importantButton.addEventListener('click', () => {
                this.toggleTextColorAndLabel(importantButton);
            });
        }
    }

    reattachImportantListeners() {
        const importantButtons = this.containerElement.querySelectorAll('.checkbox-container button');
        importantButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.toggleTextColorAndLabel(button);
            });
        });
    }

    makeLabelEditable(label) {
        label.setAttribute('contenteditable', 'true');
        label.focus();

        this.pasteEventListener = (event) => {
            event.preventDefault();
            const text = (event.clipboardData || window.clipboardData).getData('text');
            document.execCommand('insertText', false, text);
            this.updateGreyedOutState(label);
            this.saveReminders();
        };

        label.addEventListener('paste', this.pasteEventListener);

        label.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                label.setAttribute('contenteditable', 'false');
                this.updateGreyedOutState(label);
                this.saveReminders();
                this.updateFilterAndSortButtonState();
            }
        });
    }

    confirmLabelChanges() {
        const editableLabels = document.querySelectorAll('.editable-label[contenteditable="true"]');
        editableLabels.forEach(label => {
            label.setAttribute('contenteditable', 'false');
            this.updateGreyedOutState(label);
        });
        this.saveReminders();
        this.updateFilterAndSortButtonState();
    }

    updateGreyedOutState(label) {
        label.classList.toggle('greyed-out', label.textContent.trim() === '' || label.textContent === 'Group Title' || label.textContent === 'New Reminder');
    }

    setupCheckboxListener(id) {
        const checkbox = document.getElementById(`checkbox-${id}`);
        if (checkbox) {
            checkbox.addEventListener('change', () => {
                const label = checkbox.nextElementSibling;
                label.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
                this.updateClearRemindersButtonState();
                this.saveReminders();
                this.updateFilterAndSortButtonState();
            });
        }
    }

    clearReminders() {
        if (this.clearRemindersButton.classList.contains('inactive')) return;

        this.containerElement.querySelectorAll('.checkbox-container').forEach(reminder => {
            const checkbox = reminder.querySelector('input[type="checkbox"]');
            const label = reminder.querySelector('.editable-label');
            if ((checkbox && checkbox.checked) || label.classList.contains('greyed-out')) {
                reminder.remove();
            }
        });

        this.containerElement.querySelectorAll('.list-group').forEach(listGroup => {
            const groupCheckbox = listGroup.querySelector('.list-group-header input[type="checkbox"]');
            const groupTitle = listGroup.querySelector('.group-title');

            const hasNonGreyedOutReminders = Array.from(listGroup.querySelectorAll('.checkbox-container .editable-label'))
                .some(label => !label.classList.contains('greyed-out'));

            if ((groupCheckbox && groupCheckbox.checked) ||
                (groupTitle.classList.contains('greyed-out') && !hasNonGreyedOutReminders)) {
                listGroup.remove();
            }
        });

        this.updateClearRemindersButtonState();
        this.updateFilterAndSortButtonState();
        this.saveReminders();
    }

    remindersToArray() {
        return Array.from(this.containerElement.querySelectorAll('.list-group')).map(listGroup => ({
            title: listGroup.querySelector('.group-title').textContent,
            checked: listGroup.querySelector('.list-group-header input[type="checkbox"]').checked,
            reminders: Array.from(listGroup.querySelectorAll('.checkbox-container')).map(reminder => ({
                text: reminder.querySelector('.editable-label').textContent,
                checked: reminder.querySelector('input[type="checkbox"]').checked,
                important: reminder.querySelector('button').textContent === '!!',
                date: reminder.querySelector('.date-input').value
            }))
        }));
    }

    deepCopyState(state) {
        return JSON.parse(JSON.stringify(state));
    }

    saveReminders() {
        const remindersState = {
            reminderCounter: this.reminderCounter,
            groupCounter: this.groupCounter,
            showingImportant: this.showingImportant,
            sortedByDate: this.sortedByDate,
            reminders: this.remindersToArray()
        };
        if (!this.originalState) {
            this.originalState = this.deepCopyState(remindersState);
        }
        this.currentState = this.deepCopyState(remindersState);
        localStorage.setItem('remindersState', JSON.stringify(remindersState));
    }

    restoreOriginalState() {
        if (this.originalState) {
            this.currentState = this.deepCopyState(this.originalState);
            this.renderReminders();
        }
    }

    loadReminders() {
        const savedState = localStorage.getItem('remindersState');
        if (savedState) {
            const remindersState = JSON.parse(savedState);
            this.reminderCounter = remindersState.reminderCounter;
            this.groupCounter = remindersState.groupCounter;
            this.showingImportant = remindersState.showingImportant;
            this.sortedByDate = remindersState.sortedByDate;
            this.originalState = this.deepCopyState(remindersState);
            this.currentState = this.deepCopyState(remindersState);
            this.renderReminders();
        }
    }
}
