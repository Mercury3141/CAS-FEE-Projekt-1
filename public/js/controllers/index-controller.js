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