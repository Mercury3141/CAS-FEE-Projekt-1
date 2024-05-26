document.addEventListener('DOMContentLoaded', () => {
    let reminderCounter = 0;
    let currentPopup = null;

    const listGroupTemplate = Handlebars.compile(document.getElementById('list-group-template').innerHTML);
    const reminderTemplate = Handlebars.compile(document.getElementById('reminder-template').innerHTML);

    document.getElementById('toolbar-new-reminder').addEventListener('click', createListGroup);
    document.getElementById('clear-completed-reminders').addEventListener('click', clearCompletedReminders);
    document.getElementById('show-important').addEventListener('click', showImportant);
    document.getElementById('sort-by-date').addEventListener('click', sortByDate);

    function createListGroup() {
        const flexContainerElements = document.getElementById('flex-container-elements');
        const newListGroupHtml = listGroupTemplate({ id: reminderCounter });
        flexContainerElements.insertAdjacentHTML('beforeend', newListGroupHtml);
        reminderCounter++;
    }

    window.createReminder = function(event) {
        const listGroup = event.target.closest('.list-group');
        if (listGroup) {
            const newReminderHtml = reminderTemplate({ id: reminderCounter });
            listGroup.insertAdjacentHTML('beforeend', newReminderHtml);
            setupEditableLabel(reminderCounter);
            reminderCounter++;
        }
    };

    function setupEditableLabel(id) {
        const label = document.getElementById(`label-${id}`);
        label.addEventListener('click', () => {
            label.setAttribute('contenteditable', 'true');
            label.focus();
        });
        label.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                label.setAttribute('contenteditable', 'false');
            }
        });
        document.addEventListener('click', (event) => {
            if (event.target !== label) {
                label.setAttribute('contenteditable', 'false');
            }
        });
        label.addEventListener('blur', () => {
            label.setAttribute('contenteditable', 'false');
        });
    }

    window.myFunction = function(popup) {
        if (currentPopup && currentPopup !== popup) {
            currentPopup.querySelector('.popuptext').classList.remove('show');
        }
        const popupText = popup.querySelector('.popuptext');
        popupText.classList.toggle('show');
        currentPopup = popupText.classList.contains('show') ? popup : null;
    };

    document.addEventListener('click', (event) => {
        if (currentPopup && !currentPopup.contains(event.target) && event.target.tagName !== 'BUTTON') {
            currentPopup.querySelector('.popuptext').classList.remove('show');
            currentPopup = null;
        }
    }, true);

    function clearCompletedReminders() {
        const listGroups = document.querySelectorAll('.list-group');
        listGroups.forEach(listGroup => {
            const reminders = listGroup.querySelectorAll('.checkbox-container');
            reminders.forEach(reminder => {
                const checkbox = reminder.querySelector('input[type="checkbox"]');
                if (checkbox && checkbox.checked) {
                    listGroup.removeChild(reminder);
                }
            });
        });
    }

    function showImportant() {
        // Implement show important functionality
    }

    function sortByDate() {
        // Implement sort by date functionality
    }

    window.clearReminder = function(event) {
        const reminder = event.target.closest('.checkbox-container');
        reminder.remove();
    };
});