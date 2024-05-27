document.addEventListener('DOMContentLoaded', () => {
    window.reminderManager = new ReminderManager(document.getElementById('flex-container-elements'));
});

class ReminderManager {
    constructor(containerElement) {
        this.containerElement = containerElement;
        this.reminderCounter = 0;
        this.groupCounter = 0;
        this.registerEventListeners();
        this.loadReminders();
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
        document.getElementById('clear-completed-reminders').addEventListener('click', () => this.clearCompletedReminders());
        document.getElementById('show-important').addEventListener('click', () => this.showImportant());
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
        });
    }

    toggleTextColorAndLabel(button) {
        // Toggle the text color of the button and change the label between "!" and "!!"
        if (button.style.color === 'orange') {
            button.style.color = ''; // Revert to default color
            button.textContent = '!'; // Change label back to "!"
        } else {
            button.style.color = 'orange'; // Change text color to orange
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
                this.saveReminders();
            });
        }
    }

    clearCompletedReminders() {
        this.containerElement.querySelectorAll('.checkbox-container').forEach(reminder => {
            const checkbox = reminder.querySelector('input[type="checkbox"]');
            if (checkbox && checkbox.checked) {
                reminder.remove();
            }
        });
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
