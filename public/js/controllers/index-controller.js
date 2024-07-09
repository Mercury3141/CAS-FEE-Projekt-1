document.addEventListener('DOMContentLoaded', () => {
    const addGroupButton = document.querySelector("#add-group");
    const mainContainer = document.querySelector("main.flex-container-scroll");

    // Compile the Handlebars template
    const groupTemplateSource = document.querySelector("#group-template").innerHTML;
    const groupTemplate = Handlebars.compile(groupTemplateSource);

    const createNewGroup = () => {
        const groups = document.querySelectorAll('.group');
        const newGroupId = groups.length;

        // Use the compiled Handlebars template to generate HTML
        const newGroupHTML = groupTemplate({
            id: newGroupId,
            order: newGroupId,
            itemId: newGroupId * 100 + 1
        });

        mainContainer.insertAdjacentHTML('beforeend', newGroupHTML);

        const newDateInput = document.querySelector(`#item-date-${newGroupId}-0`);
        const dueDateText = document.querySelector(`#due-date-text-${newGroupId}-0`);

        newDateInput.addEventListener('input', () => {
            if (newDateInput.value) {
                dueDateText.style.display = 'block';
                dueDateText.textContent = `Due on ${newDateInput.value}`;
            } else {
                dueDateText.style.display = 'none';
            }
        });
    };

    addGroupButton.addEventListener('click', (event) => {
        event.preventDefault();
        createNewGroup();
    });
});
