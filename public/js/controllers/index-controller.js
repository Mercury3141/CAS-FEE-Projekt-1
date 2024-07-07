document.getElementById('add-group').addEventListener('click', () => {
    const newGroupData = {
        id: Date.now(),
        order: document.getElementById('main-container').children.length,
        groupName: "New Group",
        checked: false,
        items: []
    };

    addGroupToDOM(newGroupData);
    saveGroup(newGroupData);
});

function addGroupToDOM(groupData) {
    const templateSource = document.getElementById('group-template').innerHTML;
    const template = Handlebars.compile(templateSource);
    const context = { groups: [groupData] };
    const groupHTML = template(context);

    const mainContainer = document.getElementById('main-container');
    mainContainer.innerHTML += groupHTML;
}

function saveGroup(group) {
    fetch('/groups', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(group),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // Optionally update the UI further if necessary
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
