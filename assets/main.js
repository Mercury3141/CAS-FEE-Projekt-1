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
        this.sortedByDate = false;  // New property to track sorting state
        this.originalOrders = new Map();  // To store the original order of reminders
        this.importantColor = getComputedStyle(document.documentElement).getPropertyValue('--important-color').trim();
        this.clearRemindersButton = document.getElementById('clear-reminders');
        this.registerEventListeners();
        this.loadReminders();
        this.updateClearRemindersButtonState();
    }

    registerEventListeners() {
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('editable-label')) {
                this.makeLabelEditable(event.target);
            } else {
                this.confirmLabelChanges();
            }
        });

        document.getElementById('toolbar-new-reminder').addEventListener('click', () => this.createListGroup());
        this.clearRemindersButton.addEventListener('click', () => this.clearReminders());
        document.getElementById('show-important').addEventListener('click', (event) => {
            this.toggleButtonTextColor(event.target);
            this.filterImportantReminders();
        });
        document.getElementById('sort-by-date').addEventListener('click', () => this.toggleSortByDate());

        this.containerElement.addEventListener('click', event => {
            const listGroup = event.target.closest('.list-group');
            if (event.target.dataset.action === 'create-reminder' && listGroup) {
                this.createReminder(listGroup, this.reminderCounter);
                this.reminderCounter++;
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
            }
        });
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
        if (anyChecked) {
            this.clearRemindersButton.classList.remove('inactive');
            this.clearRemindersButton.classList.add('active');
        } else {
            this.clearRemindersButton.classList.remove('active');
            this.clearRemindersButton.classList.add('inactive');
        }
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
                listGroup.style.backgroundColor = this.importantColor;
                listGroup.style.display = '';
            } else {
                listGroup.style.backgroundColor = '';
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
        this.saveReminders();
    }

    createListGroup() {
        const newListGroupHtml = Handlebars.compile(document.getElementById('list-group-template').innerHTML)({id: this.groupCounter});
        this.containerElement.insertAdjacentHTML('beforeend', newListGroupHtml);
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
            });
        }
    }

    clearReminders() {
        if (this.clearRemindersButton.classList.contains('inactive')) return;

        this.containerElement.querySelectorAll('.checkbox-container').forEach(reminder => {
            const checkbox = reminder.querySelector('input[type="checkbox"]');
            if (checkbox && checkbox.checked) {
                reminder.remove();
            }
        });

        this.containerElement.querySelectorAll('.list-group').forEach(listGroup => {
            const groupCheckbox = listGroup.querySelector('.list-group-header input[type="checkbox"]');
            if (groupCheckbox && groupCheckbox.checked) {
                listGroup.remove();
            }
        });

        this.updateClearRemindersButtonState();
        this.saveReminders();
    }

    toggleSortByDate() {
        this.sortedByDate = !this.sortedByDate;

        const sortByDateButton = document.getElementById('sort-by-date');
        if (this.sortedByDate) {
            sortByDateButton.classList.add('blue-text');
        } else {
            sortByDateButton.classList.remove('blue-text');
        }

        const listGroups = this.containerElement.querySelectorAll('.list-group');

        listGroups.forEach(listGroup => {
            const remindersContainer = listGroup.querySelector('.reminders-container');
            const reminders = Array.from(remindersContainer.querySelectorAll('.checkbox-container'));

            console.log(`Before sorting: ${reminders.length} reminders`);

            // Toggle blue text for date inputs
            reminders.forEach(reminder => {
                const dateLabel = reminder.querySelector('.date-input');
                if (this.sortedByDate) {
                    dateLabel.classList.add('blue-text');
                } else {
                    dateLabel.classList.remove('blue-text');
                }
            });

            if (this.sortedByDate) {
                // Save the original order
                if (!this.originalOrders.has(remindersContainer)) {
                    this.originalOrders.set(remindersContainer, reminders.slice());
                }

                // Sort reminders by date
                const remindersWithDate = reminders.filter(reminder => reminder.querySelector('.date-input').value);
                remindersWithDate.sort((a, b) => new Date(b.querySelector('.date-input').value) - new Date(a.querySelector('.date-input').value));

                const remindersWithoutDate = reminders.filter(reminder => !reminder.querySelector('.date-input').value);

                // Detach reminders from the DOM
                remindersWithDate.forEach(reminder => remindersContainer.removeChild(reminder));
                remindersWithoutDate.forEach(reminder => remindersContainer.removeChild(reminder));

                // Reattach reminders in sorted order
                remindersWithDate.forEach(reminder => remindersContainer.appendChild(reminder));
                remindersWithoutDate.forEach(reminder => remindersContainer.appendChild(reminder));
            } else {
                // Restore the original order
                const originalReminders = this.originalOrders.get(remindersContainer);
                if (originalReminders) {
                    // Detach reminders from the DOM
                    reminders.forEach(reminder => remindersContainer.removeChild(reminder));

                    // Reattach reminders in original order
                    originalReminders.forEach(reminder => remindersContainer.appendChild(reminder));
                }
            }

            console.log(`After sorting: ${remindersContainer.querySelectorAll('.checkbox-container').length} reminders`);
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

