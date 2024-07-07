import { itemService } from '../services/item-service.js';

// Function to render groups using the Handlebars template
function renderGroups(groups) {
    const mainContainer = document.getElementById('main-container');
    const templateSource = document.getElementById('group-template').innerHTML;
    const template = Handlebars.compile(templateSource);
    const groupsHTML = template({ groups });
    mainContainer.innerHTML = groupsHTML;
}

// Load existing groups on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const groups = await itemService.getGroups();
        renderGroups(groups);
    } catch (error) {
        console.error('Error loading groups:', error);
        alert('Failed to load groups. Please try again later.');
    }
});

// Event listener for adding a new group
document.getElementById('add-group').addEventListener('click', async function() {
    const mainContainer = document.getElementById('main-container');

    // Define the data for the new group
    const newGroupData = {
        id: Date.now(),  // Generate a unique id based on the current timestamp
        order: mainContainer.children.length,  // Order based on the current number of groups
        groupName: "New Group",  // Default name for the new group
        checked: false,  // Initially unchecked
        items: []  // Initially, the new group has no items
    };

    try {
        // Create the new group using the itemService
        const createdGroup = await itemService.createGroup(newGroupData);

        // Retrieve and compile the Handlebars template
        const templateSource = document.getElementById('group-template').innerHTML;
        const template = Handlebars.compile(templateSource);

        // Generate the HTML for the new group using the template and the data
        const newGroupHTML = template({ groups: [createdGroup] });

        // Create a temporary container to hold the generated HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = newGroupHTML;

        // Append the generated group to the main container
        mainContainer.appendChild(tempDiv.firstElementChild);
    } catch (error) {
        console.error('Error creating new group:', error);
        alert('Failed to create a new group. Please try again later.');
    }
});
