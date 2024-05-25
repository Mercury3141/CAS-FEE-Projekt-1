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

function createReminder() {
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

    // Add event listeners for the new label
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
    popup.querySelector('.popuptext').classList.toggle('show');
}