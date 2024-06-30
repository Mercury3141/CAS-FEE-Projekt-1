// Have to place in correct .js file:

document.querySelectorAll('input[type="text"]').forEach(input => {
    input.addEventListener('input', function() {
        this.setAttribute('aria-label', this.value || this.placeholder);
    });
});


{
    groups: [
        {
            groupName: "New Group",
            itemName: "New Reminder",
            isChecked: true,
            important: true,
            dueDate: "2024-07-01",
            dueDateText: "Due tomorrow"
        }
    ]
}


document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('input[id^="group-checkbox-"]').forEach(groupCheckbox => {
        groupCheckbox.addEventListener('change', function() {
            const groupIndex = this.id.split('-')[2];
            const isChecked = this.checked;
            document.querySelectorAll(`#item-${groupIndex} input[type="checkbox"]`).forEach(itemCheckbox => {
                itemCheckbox.checked = isChecked;
            });
        });
    });
});


document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('input[type="date"]').forEach(dateInput => {
        dateInput.addEventListener('input', function() {
            const dueDateText = this.nextElementSibling;
            if (this.value) {
                dueDateText.style.display = 'block';
            } else {
                dueDateText.style.display = 'none';
            }
        });
        dateInput.dispatchEvent(new Event('input'));
    });
});


document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const inputField = this.nextElementSibling;
            if (this.checked) {
                inputField.style.textDecoration = 'line-through';
            } else {
                inputField.style.textDecoration = 'none';
            }
        });
    });
});
