const groupsData = {
    groups: []
};

// Function to render the view using Handlebars
function renderGroups() {
    const source = document.getElementById('group-template').innerHTML;
    const template = Handlebars.compile(source);
    const html = template(groupsData);
    document.getElementById('main-container').innerHTML = html;
}

// Initial rendering when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    renderGroups();
});

// Export the renderGroups function and groupsData object to be used in item-controller.js
export { renderGroups, groupsData };
