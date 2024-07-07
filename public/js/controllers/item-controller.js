import { renderGroups, groupsData } from './index-controller.js';

function addNewGroup() {
    // Create a new group object
    const newGroup = {
        id: groupsData.groups.length + 1,
        groupName: 'New Group',
        items: []
    };

    // Add the new group to the groups data
    groupsData.groups.push(newGroup);

    // Re-render the view
    renderGroups();
}

document.addEventListener('DOMContentLoaded', () => {
    // Event listener for the "Add New Group" button
    document.getElementById('add-group').addEventListener('click', addNewGroup);
});

// Export the functions to be used in other modules if needed
export { addNewGroup };
