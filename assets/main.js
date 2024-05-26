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
            setupCheckboxListener(reminderCounter);
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
                saveReminders(); // Trigger save on label edit
            }
        });
        document.addEventListener('click', (event) => {
            if (event.target !== label) {
                label.setAttribute('contenteditable', 'false');
                saveReminders(); // Trigger save on blur
            }
        });
        label.addEventListener('blur', () => {
            label.setAttribute('contenteditable', 'false');
            saveReminders(); // Trigger save on blur
        });
    }

    function setupCheckboxListener(id) {
        const checkbox = document.getElementById(`checkbox-${id}`);
        checkbox.addEventListener('change', () => {
            const label = checkbox.nextElementSibling;
            if (checkbox.checked) {
                label.style.textDecoration = 'line-through';
            } else {
                label.style.textDecoration = 'none';
            }
            saveReminders(); // Trigger save on checkbox change
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
        saveReminders(); // Trigger save after clearing
    }

    function showImportant() {
        // Implement show important functionality
        saveReminders(); // Trigger save on important change
    }

    function sortByDate() {
        // Implement sort by date functionality
        saveReminders(); // Trigger save on sort
    }

    window.clearReminder = function(event) {
        const reminder = event.target.closest('.checkbox-container');
        reminder.remove();
        saveReminders(); // Trigger save after removing reminder
    };

    function saveReminders() {
        const reminders = [];
        document.querySelectorAll('.list-group').forEach(listGroup => {
            const group = {
                id: listGroup.querySelector('input[type="checkbox"]').id,
                title: listGroup.querySelector('label').innerText,
                reminders: []
            };
            listGroup.querySelectorAll('.checkbox-container').forEach(reminder => {
                const reminderData = {
                    id: reminder.querySelector('input[type="checkbox"]').id,
                    text: reminder.querySelector('.editable-label').innerText,
                    important: reminder.querySelector(`#important-checkbox-${reminderCounter}`)?.checked || false,
                    dueDate: reminder.querySelector('input[type="date"]')?.value || null,
                    completed: reminder.querySelector('input[type="checkbox"]').checked
                };
                group.reminders.push(reminderData);
            });
            reminders.push(group);
        });

        fetch('/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reminders)
        })
            .then(response => response.text())
            .then(data => console.log(data))
            .catch(error => console.error('Error saving reminders:', error));
    }

    function loadReminders() {
        fetch('/load')
            .then(response => response.json())
            .then(data => {
                const flexContainerElements = document.getElementById('flex-container-elements');
                flexContainerElements.innerHTML = '';
                data.forEach(group => {
                    const newListGroupHtml = listGroupTemplate(group);
                    flexContainerElements.insertAdjacentHTML('beforeend', newListGroupHtml);
                    group.reminders.forEach(reminder => {
                        const newReminderHtml = reminderTemplate(reminder);
                        document.querySelector(`#${group.id}`).closest('.list-group').insertAdjacentHTML('beforeend', newReminderHtml);
                        setupEditableLabel(reminder.id);
                        setupCheckboxListener(reminder.id);
                    });
                });
            })
            .catch(error => console.error('Error loading reminders:', error));
    }

    // Initial load
    loadReminders();

    // Autosave interval (e.g., every 30 seconds)
    const autosaveInterval = 30000; // 30,000 milliseconds = 30 seconds
    setInterval(saveReminders, autosaveInterval);
});