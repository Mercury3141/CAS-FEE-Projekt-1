document.addEventListener('DOMContentLoaded', () => {
    const label = document.getElementById('myLabel');
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
});

let reminderCounter = 0;
let currentPopup = null;

function createReminder(event) {
    // Check if the "New Reminder" button in the toolbar triggered the function
    if (event && event.target && event.target.id === 'toolbar-new-reminder') {
        const flexContainerElements = document.getElementById('flex-container-elements');
        const newListGroup = document.createElement('div');
        newListGroup.className = 'list-group';
        newListGroup.innerHTML = `
            <input type="checkbox" id="button-checkbox-${reminderCounter}">
            <label for="button-checkbox-${reminderCounter}" class="text-font text-title">Group Title</label><br/>
            <button class="button-margin-bottom" onclick="createReminder()">New Reminder</button>
            <br/>
        `;
        flexContainerElements.appendChild(newListGroup);
        return;
    }

    reminderCounter++;
    const listGroup = document.getElementById('list-group');
    const newCheckboxContainer = document.createElement('div');
    newCheckboxContainer.className = 'checkbox-container';
    const newCheckbox = document.createElement('input');
    newCheckbox.type = 'checkbox';
    newCheckbox.id = `checkbox-${reminderCounter}`;
    const newLabel = document.createElement('span');
    newLabel.className = 'editable-label text-font text-list';
    newLabel.contentEditable = 'false';
    newLabel.id = `label-${reminderCounter}`;
    newLabel.innerText = 'New Reminder';
    newCheckbox.addEventListener('change', function() {
        if (this.checked) {
            newLabel.style.textDecoration = 'line-through';
        } else {
            newLabel.style.textDecoration = 'none';
        }
    });
    const popup = document.createElement('div');
    popup.className = 'popup';
    const popupButton = document.createElement('button');
    popupButton.innerText = 'i';
    popupButton.onclick = () => myFunction(popup);
    const popupContent = document.createElement('span');
    popupContent.className = 'popuptext';
    popupContent.id = `popup-${reminderCounter}`;
    const addNotesButton = document.createElement('button');
    addNotesButton.className = 'button-margin-bottom';
    addNotesButton.onclick = createReminder;
    addNotesButton.innerText = 'Add Notes';
    const importantCheckbox = document.createElement('input');
    importantCheckbox.type = 'checkbox';
    importantCheckbox.id = `important-checkbox-${reminderCounter}`;
    const importantLabel = document.createElement('label');
    importantLabel.className = 'text-label';
    importantLabel.htmlFor = `important-checkbox-${reminderCounter}`;
    importantLabel.innerText = 'Important';
    const dueDateLabel = document.createElement('label');
    dueDateLabel.className = 'text-label';
    dueDateLabel.innerText = 'Due Date:';
    const dueDateInput = document.createElement('input');
    dueDateInput.className = 'button-margin-bottom';
    dueDateInput.type = 'date';
    const clearReminderButton = document.createElement('button');
    clearReminderButton.className = 'color-caution';
    clearReminderButton.onclick = createReminder;
    clearReminderButton.innerText = 'Clear Reminder';
    popupContent.appendChild(addNotesButton);
    popupContent.appendChild(document.createElement('br'));
    popupContent.appendChild(document.createElement('br'));
    popupContent.appendChild(importantCheckbox);
    popupContent.appendChild(importantLabel);
    popupContent.appendChild(document.createElement('br'));
    popupContent.appendChild(document.createElement('br'));
    popupContent.appendChild(dueDateLabel);
    popupContent.appendChild(document.createElement('br'));
    popupContent.appendChild(dueDateInput);
    popupContent.appendChild(document.createElement('br'));
    popupContent.appendChild(document.createElement('br'));
    popupContent.appendChild(clearReminderButton);
    popup.appendChild(popupButton);
    popup.appendChild(popupContent);
    newCheckboxContainer.appendChild(newCheckbox);
    newCheckboxContainer.appendChild(newLabel);
    newCheckboxContainer.appendChild(popup);
    newCheckboxContainer.appendChild(document.createElement('br'));
    listGroup.appendChild(newCheckboxContainer);
    newLabel.addEventListener('click', () => {
        newLabel.setAttribute('contenteditable', 'true');
        newLabel.focus();
    });
    newLabel.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            newLabel.setAttribute('contenteditable', 'false');
        }
    });
    document.addEventListener('click', (event) => {
        if (event.target !== newLabel) {
            newLabel.setAttribute('contenteditable', 'false');
        }
    });
    newLabel.addEventListener('blur', () => {
        newLabel.setAttribute('contenteditable', 'false');
    });
}

function myFunction(popup) {
    if (currentPopup && currentPopup !== popup) {
        currentPopup.querySelector('.popuptext').classList.remove('show');
    }
    const popupText = popup.querySelector('.popuptext');
    popupText.classList.toggle('show');
    currentPopup = popupText.classList.contains('show') ? popup : null;
}

document.addEventListener('click', (event) => {
    if (currentPopup && !currentPopup.contains(event.target) && event.target.tagName !== 'BUTTON') {
        currentPopup.querySelector('.popuptext').classList.remove('show');
        currentPopup = null;
    }
}, true);

function clearCompletedReminders() {
    const listGroup = document.getElementById('list-group');
    const reminders = listGroup.querySelectorAll('.checkbox-container');
    reminders.forEach(reminder => {
        const checkbox = reminder.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
            listGroup.removeChild(reminder);
        }
    });
}