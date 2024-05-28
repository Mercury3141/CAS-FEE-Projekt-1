document.addEventListener('DOMContentLoaded', () => {
    window.reminderManager = new ReminderManager(document.getElementById('flex-container-elements'));
});

class ReminderManager {
    constructor(containerElement) {
        this.containerElement = containerElement;
        this.reminderCounter = 0;
        this.groupCounter = 0;
        this.showingImportant = false;
        this.importantColor = getComputedStyle(document.documentElement).getPropertyValue('--important-color').trim();
        this.clearCompletedButton = document.getElementById('clear-completed-reminders');
        this.registerEventListeners();
        this.loadReminders();
        this.updateClearCompletedButtonState();
    }

    registerEventListeners() {
        document.addEventListener('click', (event) => {
            // Handle clicks to make labels editable and confirm changes
            if (event.target.classList.contains('editable-label')) {
                this.makeLabelEditable(event.target);
            } else {
                this.confirmLabelChanges();
            }
        });

        // Toolbar buttons
        document.getElementById('toolbar-new-reminder').addEventListener('click', () => this.createListGroup());
        this.clearCompletedButton.addEventListener('click', () => this.clearCompletedReminders());
        document.getElementById('show-important').addEventListener('click', (event) => {
            this.toggleButtonTextColor(event.target);
            this.filterImportantReminders();
        });
        document.getElementById('sort-by-date').addEventListener('click', () => this.sortByDate());

        // Dynamic content event delegation for "New Reminder"
        this.containerElement.addEventListener('click', event => {
            const listGroup = event.target.closest('.list-group');
            if (event.target.dataset.action === 'create-reminder' && listGroup) {
                this.createReminder(listGroup, this.reminderCounter);
                this.reminderCounter++;
            }
        });

        // Event delegation for group checkboxes
        this.containerElement.addEventListener('change', event => {
            if (event.target.matches('.list-group-header input[type="checkbox"]')) {
                this.toggleGroupCheckboxes(event.target);
            }
            if (event.target.matches('.checkbox-container input[type="checkbox"]')) {
                this.updateClearCompletedButtonState();
            }
        });
    }

    toggleButtonTextColor(button) {
        // Toggle the text color of the button to the important color and back to default
        if (button.style.color === this.importantColor) {
            button.style.color = ''; // Revert to default color
        } else {
            button.style.color = this.importantColor; // Change text color to important color
        }
    }

    updateClearCompletedButtonState() {
        const anyChecked = this.containerElement.querySelector('.checkbox-container input[type="checkbox"]:checked') ||
            this.containerElement.querySelector('.list-group-header input[type="checkbox"]:checked');
        if (anyChecked) {
            this.clearCompletedButton.classList.remove('inactive');
            this.clearCompletedButton.classList.add('active');
        } else {
            this.clearCompletedButton.classList.remove('active');
            this.clearCompletedButton.classList.add('inactive');
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
        // Toggle the text color of the button and change the label between "!" and "!!"
        if (button.style.color === this.importantColor) {
            button.style.color = ''; // Revert to default color
            button.textContent = '!'; // Change label back to "!"
        } else {
            button.style.color = this.importantColor; // Change text color to important color
            button.textContent = '!!'; // Change label to "!!"
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

        // Toggle strikethrough for the group title
        const groupTitle = listGroup.querySelector('.group-title');
        groupTitle.style.textDecoration = groupCheckbox.checked ? 'line-through' : 'none';

        this.updateClearCompletedButtonState();
        this.saveReminders();
    }

    createListGroup() {
        const newListGroupHtml = Handlebars.compile(document.getElementById('list-group-template').innerHTML)({ id: this.groupCounter });
        this.containerElement.insertAdjacentHTML('beforeend', newListGroupHtml);
        this.groupCounter++;
    }

    createReminder(listGroup, id) {
        const newReminderHtml = Handlebars.compile(document.getElementById('reminder-template').innerHTML)({ id });
        listGroup.querySelector('.reminders-container').insertAdjacentHTML('beforeend', newReminderHtml);

        this.setupImportantCheckboxListener(id);
        this.setupCheckboxListener(id);
        this.updateClearCompletedButtonState();
    }

    setupImportantCheckboxListener(id) {
        const importantCheckbox = document.getElementById(`important-checkbox-${id}`);
        const label = document.getElementById(`label-${id}`);
        if (importantCheckbox) {
            importantCheckbox.addEventListener('change', () => {
                if (importantCheckbox.checked) {
                    label.style.color = 'red'; // Change text color to red if checkbox is checked
                } else {
                    label.style.color = ''; // Revert to default text color if checkbox is unchecked
                }
                this.saveReminders();
            });
        }
    }

    makeLabelEditable(label) {
        label.setAttribute('contenteditable', 'true');
        label.focus();
    }

    confirmLabelChanges() {
        const editableLabels = document.querySelectorAll('.editable-label[contenteditable="true"]');
        editableLabels.forEach(label => {
            label.setAttribute('contenteditable', 'false');
        });
        this.saveReminders();
    }

    setupCheckboxListener(id) {
        const checkbox = document.getElementById(`checkbox-${id}`);
        if (checkbox) {
            checkbox.addEventListener('change', () => {
                const label = checkbox.nextElementSibling;
                label.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
                this.updateClearCompletedButtonState();
                this.saveReminders();
            });
        }
    }

    clearCompletedReminders() {
        if (this.clearCompletedButton.classList.contains('inactive')) return; // Prevent action if button is inactive

        // Remove reminders that are checked
        this.containerElement.querySelectorAll('.checkbox-container').forEach(reminder => {
            const checkbox = reminder.querySelector('input[type="checkbox"]');
            if (checkbox && checkbox.checked) {
                reminder.remove();
            }
        });

        // Remove list-groups where the group title checkbox is checked
        this.containerElement.querySelectorAll('.list-group').forEach(listGroup => {
            const groupCheckbox = listGroup.querySelector('.list-group-header input[type="checkbox"]');
            if (groupCheckbox && groupCheckbox.checked) {
                listGroup.remove();
            }
        });

        this.updateClearCompletedButtonState();
        this.saveReminders();
    }

    showImportant() {
        // Logic to filter and show important reminders
        this.saveReminders();
    }

    sortByDate() {
        // Logic to sort reminders by due date
        this.saveReminders();
    }

    saveReminders() {
        // Placeholder for saving reminders logic, possibly to local storage or a server
    }

    loadReminders() {
        // Placeholder for loading reminders logic, possibly from local storage or a server
    }
}
