"use strict";

document.addEventListener('DOMContentLoaded', () => {
    window.reminderManager = new ReminderManager(document.getElementById('flex-container-elements'));
});

class ReminderManager {
    constructor(containerElement) {
        this.containerElement = containerElement;
        this.reminderCounter = 0;
        this.groupCounter = 0;
        this.showingImportant = false;
        this.sortedByDate = false;
        this.originalOrders = new Map();
        this.selectedGroup = null;
        this.importantColor = getComputedStyle(document.documentElement).getPropertyValue('--important-color').trim();
        this.selectionColor = 'rgb(0, 122, 255)';
        this.clearRemindersButton = document.getElementById('clear-reminders');
        this.showImportantButton = document.getElementById('show-important');
        this.sortByDateButton = document.getElementById('sort-by-date');
        this.registerEventListeners();
        this.loadReminders();
        this.updateClearRemindersButtonState();
        this.updateFilterAndSortButtonState();
    }

    registerEventListeners() {
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('editable-label')) {
                this.makeLabelEditable(event.target);
            } else {
                this.confirmLabelChanges();
            }
        });

        document.getElementById('toolbar-new-reminder').addEventListener('click', () => {
            this.cancelFilters();
            this.createListGroup();
            this.updateFilterAndSortButtonState();
        });

        this.clearRemindersButton.addEventListener('click', () => {
            this.clearReminders();
            this.updateFilterAndSortButtonState();
        });

        this.showImportantButton.addEventListener('click', (event) => {
            if (!event.target.classList.contains('inactive')) {
                this.toggleButtonTextColor(event.target);
                this.filterImportantReminders();
            }
        });

        this.sortByDateButton.addEventListener('click', () => {
            if (!this.sortByDateButton.classList.contains('inactive')) {
                this.toggleSortByDate();
            }
        });

        this.containerElement.addEventListener('click', event => {
            const listGroup = event.target.closest('.list-group');
            if (listGroup) {
                this.selectListGroup(listGroup);
            }
            if (event.target.dataset.action === 'create-reminder' && listGroup) {
                this.createReminder(listGroup, this.reminderCounter);
                this.reminderCounter++;
                this.updateFilterAndSortButtonState();
            }
        });

        this.containerElement.addEventListener('change', event => {
            if (event.target.matches('.list-group-header input[type="checkbox"]')) {
                this.toggleGroupCheckboxes(event.target);
            }
            if (event.target.matches('.checkbox-container input[type="checkbox"]')) {
                this.updateClearRemindersButtonState();
            }
        });

        this.containerElement.addEventListener('input', event => {
            if (event.target.classList.contains('editable-label')) {
                this.updateGreyedOutState(event.target);
            }
        });

        this.containerElement.addEventListener('keydown', event => {
            if (event.target.classList.contains('editable-label') && event.key === 'Enter') {
                event.preventDefault();
                this.confirmLabelChanges();
            } else if (this.selectedGroup && (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'Delete')) {
                this.handleKeyActions(event);
            }
        });
    }

    selectListGroup(listGroup) {
        if (this.selectedGroup) {
            this.selectedGroup.style.outline = '';
        }
        this.selectedGroup = listGroup;
        this.selectedGroup.style.outline = `2px solid ${this.selectionColor}`;
    }

    handleKeyActions(event) {
        if (!this.selectedGroup) return;
        switch (event.key) {
            case 'ArrowUp':
                this.moveGroupUp();
                break;
            case 'ArrowDown':
                this.moveGroupDown();
                break;
            case 'Delete':
                this.deleteSelectedGroup();
                break;
        }
    }

    moveGroupUp() {
        const prevSibling = this.selectedGroup.previousElementSibling;
        if (prevSibling) {
            this.containerElement.insertBefore(this.selectedGroup, prevSibling);
        }
    }

    moveGroupDown() {
        const nextSibling = this.selectedGroup.nextElementSibling;
        if (nextSibling) {
            this.containerElement.insertBefore(nextSibling, this.selectedGroup);
        }
    }

    deleteSelectedGroup() {
        if (this.selectedGroup) {
            this.selectedGroup.remove();
            this.selectedGroup = null;
            this.updateClearRemindersButtonState();
            this.updateFilterAndSortButtonState();
            this.saveReminders();
        }
    }

    cancelFilters() {
        if (this.showingImportant) {
            this.toggleButtonTextColor(this.showImportantButton);
            this.filterImportantReminders();
        }
        if (this.sortedByDate) {
            this.toggleSortByDate();
        }
    }

    toggleButtonTextColor(button) {
        if (button.style.color === this.importantColor) {
            button.style.color = '';
        } else {
            button.style.color = this.importantColor;
        }
    }

    updateClearRemindersButtonState() {
        const anyChecked = this.containerElement.querySelector('.checkbox-container input[type="checkbox"]:checked') ||
            this.containerElement.querySelector('.list-group-header input[type="checkbox"]:checked');
        const anyGreyedOut = this.containerElement.querySelector('.editable-label.greyed-out');

        if (anyChecked || anyGreyedOut) {
            this.clearRemindersButton.classList.remove('inactive');
            this.clearRemindersButton.classList.add('active');
        } else {
            this.clearRemindersButton.classList.remove('active');
            this.clearRemindersButton.classList.add('inactive');
        }
    }


    updateFilterAndSortButtonState() {
        const anyImportantReminders = this.checkForImportantReminders();
        const anyRemindersWithDates = this.checkForRemindersWithDates();

        if (anyImportantReminders) {
            this.showImportantButton.classList.remove('inactive');
        } else {
            this.showImportantButton.classList.add('inactive');
        }

        if (anyRemindersWithDates) {
            this.sortByDateButton.classList.remove('inactive');
        } else {
            this.sortByDateButton.classList.add('inactive');
        }
    }

    checkForImportantReminders() {
        return !!this.containerElement.querySelector('.checkbox-container button[style*="color: ' + this.importantColor + '"]');
    }

    checkForRemindersWithDates() {
        return !!this.containerElement.querySelector('.checkbox-container .date-input[value]');
    }

    filterImportantReminders() {
        this.showingImportant = !this.showingImportant;
        const listGroups = this.containerElement.querySelectorAll('.list-group');
        listGroups.forEach(listGroup => {
            const reminders = listGroup.querySelectorAll('.checkbox-container');
            let hasImportant = false;
            reminders.forEach(reminder => {
                const importantButton = reminder.querySelector('button');
                if (this.showingImportant) {
                    if (importantButton.textContent === '!!') {
                        reminder.style.display = '';
                        hasImportant = true;
                    } else {
                        reminder.style.display = 'none';
                    }
                } else {
                    reminder.style.display = '';
                }
            });
            if (this.showingImportant && hasImportant) {
                listGroup.style.outline = `2px solid ${this.importantColor}`;
                listGroup.style.display = '';
            } else {
                listGroup.style.outline = '';
                if (this.showingImportant) {
                    listGroup.style.display = 'none';
                } else {
                    listGroup.style.display = '';
                }
            }
        });
    }

    toggleTextColorAndLabel(button) {
        if (button.style.color === this.importantColor) {
            button.style.color = '';
            button.textContent = '!';
        } else {
            button.style.color = this.importantColor;
            button.textContent = '!!';
        }
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
        const newListGroupHtml = Handlebars.compile(document.getElementById('list-group-template').innerHTML)({id: this.groupCounter});
        this.containerElement.insertAdjacentHTML('afterbegin', newListGroupHtml);
        this.groupCounter++;
        const newListGroup = this.containerElement.querySelector(`#list-group-${this.groupCounter - 1} .group-title`);
        newListGroup.classList.add('greyed-out');
    }


    createReminder(listGroup, id) {
        const newReminderHtml = Handlebars.compile(document.getElementById('reminder-template').innerHTML)({id});
        listGroup.querySelector('.reminders-container').insertAdjacentHTML('beforeend', newReminderHtml);

        this.setupImportantCheckboxListener(id);
        this.setupCheckboxListener(id);
        this.updateClearRemindersButtonState();
        this.updateFilterAndSortButtonState();

        const newReminder = listGroup.querySelector(`#label-${id}`);
        newReminder.classList.add('greyed-out');

        const dateInput = listGroup.querySelector(`#date-${id}`);
        dateInput.classList.add('date-input');

        this.makeLabelEditable(newReminder);
    }

    setupImportantCheckboxListener(id) {
        const importantCheckbox = document.getElementById(`important-checkbox-${id}`);
        const label = document.getElementById(`label-${id}`);
        if (importantCheckbox) {
            importantCheckbox.addEventListener('change', () => {
                if (importantCheckbox.checked) {
                    label.style.color = 'red';
                } else {
                    label.style.color = '';
                }
                this.saveReminders();
                this.updateFilterAndSortButtonState();
            });
        }
    }

    makeLabelEditable(label) {
        label.setAttribute('contenteditable', 'true');
        label.focus();
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
        if (label.textContent.trim() === '' || label.textContent === 'Group Title' || label.textContent === 'New Reminder') {
            label.classList.add('greyed-out');
        } else {
            label.classList.remove('greyed-out');
        }
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

        // Remove individual reminders
        this.containerElement.querySelectorAll('.checkbox-container').forEach(reminder => {
            const checkbox = reminder.querySelector('input[type="checkbox"]');
            const label = reminder.querySelector('.editable-label');
            if ((checkbox && checkbox.checked) || label.classList.contains('greyed-out')) {
                reminder.remove();
            }
        });

        // Remove entire list groups if their title is greyed-out and they have no non-greyed-out reminders
        this.containerElement.querySelectorAll('.list-group').forEach(listGroup => {
            const groupCheckbox = listGroup.querySelector('.list-group-header input[type="checkbox"]');
            const groupTitle = listGroup.querySelector('.group-title');

            // Check if there are any non-greyed-out reminders in the list group
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

    updateClearRemindersButtonState() {
        const anyChecked = this.containerElement.querySelector('.checkbox-container input[type="checkbox"]:checked') ||
            this.containerElement.querySelector('.list-group-header input[type="checkbox"]:checked');
        const anyGreyedOut = this.containerElement.querySelector('.editable-label.greyed-out');

        if (anyChecked || anyGreyedOut) {
            this.clearRemindersButton.classList.remove('inactive');
            this.clearRemindersButton.classList.add('active');
        } else {
            this.clearRemindersButton.classList.remove('active');
            this.clearRemindersButton.classList.add('inactive');
        }
    }


    toggleSortByDate() {
        this.sortedByDate = !this.sortedByDate;

        if (this.sortedByDate) {
            this.sortByDateButton.classList.add('blue-text');
        } else {
            this.sortByDateButton.classList.remove('blue-text');
        }

        const listGroups = this.containerElement.querySelectorAll('.list-group');

        listGroups.forEach(listGroup => {
            const remindersContainer = listGroup.querySelector('.reminders-container');
            const reminders = Array.from(remindersContainer.querySelectorAll('.checkbox-container'));

            reminders.forEach(reminder => {
                const dateLabel = reminder.querySelector('.date-input');
                if (this.sortedByDate) {
                    dateLabel.classList.add('blue-text');
                } else {
                    dateLabel.classList.remove('blue-text');
                }
            });

            if (this.sortedByDate) {
                if (!this.originalOrders.has(remindersContainer)) {
                    this.originalOrders.set(remindersContainer, reminders.slice());
                }

                const remindersWithDate = reminders.filter(reminder => reminder.querySelector('.date-input').value);
                remindersWithDate.sort((a, b) => new Date(b.querySelector('.date-input').value) - new Date(a.querySelector('.date-input').value));

                const remindersWithoutDate = reminders.filter(reminder => !reminder.querySelector('.date-input').value);

                remindersWithDate.forEach(reminder => remindersContainer.removeChild(reminder));
                remindersWithoutDate.forEach(reminder => remindersContainer.removeChild(reminder));

                remindersWithDate.forEach(reminder => remindersContainer.appendChild(reminder));
                remindersWithoutDate.forEach(reminder => remindersContainer.appendChild(reminder));
            } else {
                const originalReminders = this.originalOrders.get(remindersContainer);
                if (originalReminders) {
                    reminders.forEach(reminder => remindersContainer.removeChild(reminder));
                    originalReminders.forEach(reminder => remindersContainer.appendChild(reminder));
                }
            }
        });

        this.saveReminders();
    }

    saveReminders() {
        // Placeholder for saving reminders logic
    }

    loadReminders() {
        // Placeholder for loading reminders logic
    }
}
