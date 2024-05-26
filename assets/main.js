document.addEventListener('DOMContentLoaded', () => {
    const reminderManager = new ReminderManager(document.getElementById('flex-container-elements'));
});

class ReminderManager {
    constructor(containerElement) {
        this.containerElement = containerElement;
        this.reminderCounter = 0;
        this.currentPopup = null;
        this.registerEventListeners();
        this.loadReminders();
    }

    registerEventListeners() {
        document.addEventListener('click', (event) => {
            // Close the popup when clicking outside of any popup container
            if (!event.target.closest('.popup') && this.currentPopup) {
                this.currentPopup.classList.remove('show');
                this.currentPopup = null;
            }
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

        // Dynamic content event delegation for "New Reminder" and popup information buttons
        this.containerElement.addEventListener('click', event => {
            const listGroup = event.target.closest('.list-group');
            if (event.target.dataset.action === 'create-reminder' && listGroup) {
                this.createReminder(listGroup, this.reminderCounter);
            } else if (event.target.matches('button') && event.target.closest('.popup')) {
                const popup = event.target.closest('.list-group').querySelector('.popuptext');
                this.togglePopup(popup);
            }
        });
    }

    togglePopup(popup) {
        // Close the current popup if it's not the one being toggled
        if (this.currentPopup && this.currentPopup !== popup) {
            this.currentPopup.classList.remove('show');
        }
        // Toggle the visibility of the clicked popup
        popup.classList.toggle('show');
        // Update the currentPopup reference
        this.currentPopup = popup.classList.contains('show') ? popup : null;
    }

    createListGroup() {
        const newListGroupHtml = Handlebars.compile(document.getElementById('list-group-template').innerHTML)({ id: this.reminderCounter });
        this.containerElement.insertAdjacentHTML('beforeend', newListGroupHtml);
        this.reminderCounter++;
    }

    createReminder(listGroup, id) {
        const newReminderHtml = Handlebars.compile(document.getElementById('reminder-template').innerHTML)({ id });
        listGroup.insertAdjacentHTML('beforeend', newReminderHtml);
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
        checkbox.addEventListener('change', () => {
            const label = checkbox.nextElementSibling;
            label.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
            this.saveReminders();
        });
    }

    clearCompletedReminders() {
        this.containerElement.querySelectorAll('.checkbox-container').forEach(reminder => {
            const checkbox = reminder.querySelector('input[type="checkbox"]');
            if (checkbox.checked) {
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
