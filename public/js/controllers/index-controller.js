document.addEventListener('DOMContentLoaded', function() {
    const addGroupButton = document.getElementById('add-group');
    const groupListDiv = document.getElementById('group-list');
    const resultDiv = document.getElementById('result');

    async function addNewGroup() {
        const newGroup = {
            id: Date.now(),
            order: 1,
            checked: false,
            textContent: "New Group"
        };

        try {
            const response = await fetch('/api/groups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newGroup),
            });

            const data = await response.json();
            if (data.success) {
                loadAndRenderGroups();
            } else {
                resultDiv.innerHTML = `<pre>${JSON.stringify(data.error, null, 2)}</pre>`;
            }
        } catch (error) {
            console.error('Error creating group:', error);
            resultDiv.innerHTML = `<pre>${error.message}</pre>`;
        }
    }

    async function loadAndRenderGroups() {
        try {
            const response = await fetch('/api/groups');
            const data = await response.json();

            groupListDiv.innerHTML = '';
            data.groups.forEach(group => {
                const groupDiv = document.createElement('div');
                groupDiv.innerHTML = `
          <div>
            <input type="checkbox" ${group.checked ? 'checked' : ''} />
            ${group.textContent}
          </div>
        `;
                groupListDiv.appendChild(groupDiv);
            });
        } catch (error) {
            console.error('Error loading groups:', error);
            resultDiv.innerHTML = `<pre>${error.message}</pre>`;
        }
    }

    addGroupButton.addEventListener('click', addNewGroup);

    // Load and render groups on page load
    loadAndRenderGroups();
});
