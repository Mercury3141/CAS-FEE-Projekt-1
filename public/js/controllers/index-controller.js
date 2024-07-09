document.addEventListener('DOMContentLoaded', () => {
    const addGroupButton = document.querySelector("#add-group");
    const mainContainer = document.querySelector("main.flex-container-scroll");

    // Compile the Handlebars template once
    const groupTemplateSource = document.querySelector("#group-template").innerHTML;
    const groupTemplate = Handlebars.compile(groupTemplateSource);

    const createGroupData = (groupsCount) => {
        return {
            id: groupsCount,
            order: groupsCount,
            itemId: groupsCount * 100 + 1
        };
    };

    const renderGroup = async (groupData) => {
        // Use the compiled Handlebars template to generate HTML
        const newGroupHTML = groupTemplate(groupData);
        mainContainer.insertAdjacentHTML('beforeend', newGroupHTML);

        const newDateInput = document.querySelector(`#item-date-${groupData.id}-0`);
        const dueDateText = document.querySelector(`#due-date-text-${groupData.id}-0`);

        newDateInput.addEventListener('input', () => {
            if (newDateInput.value) {
                dueDateText.style.display = 'block';
                dueDateText.textContent = `Due on ${newDateInput.value}`;
            } else {
                dueDateText.style.display = 'none';
            }
        });

        // Simulate an asynchronous operation (e.g., fetching data from an API)
        await new Promise(resolve => setTimeout(resolve, 100));  // Example async operation
    };

    const createAndRenderGroup = async () => {
        const groupsCount = document.querySelectorAll('.group').length;
        const newGroupData = createGroupData(groupsCount);
        await renderGroup(newGroupData);
    };

    addGroupButton.addEventListener('click', async (event) => {
        event.preventDefault();
        await createAndRenderGroup();
    });
});
