document.addEventListener('DOMContentLoaded', function() {
    const groupList = document.getElementById('group-list');
    const addGroupButton = document.getElementById('add-group');
    const groupTemplateSource = document.getElementById('group-template').innerHTML;
    const groupTemplate = Handlebars.compile(groupTemplateSource);
    let groupIdCounter = 0;

    addGroupButton.addEventListener('click', function() {
        const newGroupId = `group-${groupIdCounter++}`;
        const order = groupIdCounter; // Assuming order is the sequence of creation
        const newGroupHtml = groupTemplate({ id: newGroupId, order: order });
        groupList.innerHTML += newGroupHtml;

        const groupElement = document.getElementById(`group-${newGroupId}`);
        saveGroupData(groupElement);
    });

    function saveGroupData(groupElement) {
        const groupId = groupElement.dataset.id;
        const order = groupElement.dataset.order;
        const checkboxState = document.getElementById(`group-checkbox-${groupId}`).checked;
        const groupTitle = document.getElementById(`reminders-group-${groupId}`).value;

        const groupData = {
            id: groupId,
            order: order,
            checkboxState: checkboxState,
            groupTitle: groupTitle
        };

        fetch('/api/groups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(groupData)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Group data saved:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Optionally, you could add event listeners to save data when the checkbox or text input changes
    groupList.addEventListener('change', function(event) {
        const target = event.target;
        if (target.classList.contains('label-heading') || target.type === 'checkbox') {
            const groupElement = target.closest('.group');
            saveGroupData(groupElement);
        }
    });
});
