document.addEventListener('DOMContentLoaded', function() {
    const groupList = document.getElementById('group-list');
    const addGroupButton = document.getElementById('add-group');
    const groupTemplateSource = document.getElementById('group-template').innerHTML;
    const groupTemplate = Handlebars.compile(groupTemplateSource);
    let groupIdCounter = 0;

    addGroupButton.addEventListener('click', function() {
        const newGroupId = `group-${groupIdCounter++}`;
        const newGroupHtml = groupTemplate({ id: newGroupId });
        groupList.innerHTML += newGroupHtml;

        saveGroupId(newGroupId);
    });

    function saveGroupId(groupId) {
        fetch('/api/groups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: groupId })
        })
            .then(response => response.json())
            .then(data => {
                console.log('Group ID saved:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
});
