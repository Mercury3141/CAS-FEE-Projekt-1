class Toolbar {
    constructor() {
        this.elements = [];
    }

    addElement(element) {
        this.elements.push(element);
    }

    render() {
        // Rendering logic here
        console.log('Rendering toolbar with elements:', this.elements);
    }
}

// Button class (generic button)
class Button {
    constructor(label) {
        this.label = label;
    }

    click() {
        console.log(`${this.label} button clicked`);
    }

    render() {
        // Rendering logic here
        console.log(`Rendering button: ${this.label}`);
    }
}

// Specific button classes
class ButtonNewGroup extends Button {
    constructor() {
        super('New Group');
    }
}

class ButtonSort extends Button {
    constructor() {
        super('Sort');
    }
}

class ButtonDisplayPriority extends Button {
    constructor() {
        super('Display Priority');
    }
}

class ButtonDisplayDueDate extends Button {
    constructor() {
        super('Display Due Date');
    }
}

class ButtonClearAll extends Button {
    constructor() {
        super('Clear All');
    }
}

// ScrollArea class
class ScrollArea {
    constructor() {
        this.content = [];
    }

    addContent(item) {
        this.content.push(item);
    }

    scroll() {
        console.log('Scrolling through content:', this.content);
    }

    render() {
        // Rendering logic here
        console.log('Rendering scroll area with content:', this.content);
    }
}

// ListGroup class
class ListGroup {
    constructor() {
        this.groups = [];
    }

    addGroup(group) {
        this.groups.push(group);
    }

    render() {
        // Rendering logic here
        console.log('Rendering list group with groups:', this.groups);
    }
}

// TitleElement class
class TitleElement {
    constructor(text) {
        this.text = text;
    }

    render() {
        // Rendering logic here
        console.log(`Rendering title element: ${this.text}`);
    }
}

// TitleText class
class TitleText {
    constructor(text) {
        this.text = text;
    }

    render() {
        // Rendering logic here
        console.log(`Rendering title text: ${this.text}`);
    }
}

// ListElement class
class ListElement {
    constructor(text) {
        this.text = text;
        this.isChecked = false;
    }

    toggleCheckbox() {
        this.isChecked = !this.isChecked;
        console.log(`Checkbox ${this.isChecked ? 'checked' : 'unchecked'}`);
    }

    render() {
        // Rendering logic here
        console.log(`Rendering list element: ${this.text}`);
    }
}

// ButtonCheckbox class
class ButtonCheckbox extends Button {
    constructor() {
        super('Checkbox');
    }

    toggle() {
        console.log('Checkbox button toggled');
    }
}

// ElementText class
class ElementText {
    constructor(text) {
        this.text = text;
    }

    render() {
        // Rendering logic here
        console.log(`Rendering element text: ${this.text}`);
    }
}

// Info button class
class ButtonInfo extends Button {
    constructor() {
        super('Info');
    }

    showInfo() {
        console.log('Showing info');
    }
}

// Comment button class
class ButtonComment extends Button {
    constructor() {
        super('Comment');
    }

    addComment() {
        console.log('Adding comment');
    }
}

// Priority button class
class ButtonPriority extends Button {
    constructor() {
        super('Priority');
    }

    setPriority(level) {
        console.log(`Setting priority to ${level}`);
    }
}

// DueDate button class
class ButtonDueDate extends Button {
    constructor() {
        super('Due Date');
    }

    setDueDate(date) {
        console.log(`Setting due date to ${date}`);
    }
}

// Clear button class
class ButtonClear extends Button {
    constructor() {
        super('Clear');
    }

    clear() {
        console.log('Clearing item');
    }
}

// ButtonNewElement class
class ButtonNewElement extends Button {
    constructor() {
        super('New Element');
    }

    addElement() {
        console.log('Adding new element');
    }
}




/*function createReminder() {
    var listElement = document.createElement("div");
    listElement.classList.add("list-element");

    var checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.classList.add("button-checkbox"); // Add a class to identify checkboxes

    var label = document.createElement("label");
    label.setAttribute("for", "button-checkbox");

    var text = document.createElement("h2");
    text.classList.add("element-text", "text-font", "text-list");
    text.textContent = "Text";

    listElement.appendChild(checkbox);
    listElement.appendChild(label);
    listElement.appendChild(text);

    var listGroup = document.querySelector(".list-group");

    listGroup.appendChild(listElement);

    checkbox.addEventListener("change", function() {
        if (this.checked) {
            // Remove the parent element (reminder item) when checkbox is checked
            this.parentElement.remove();
            updateButtonMargin(); // Call function to update button margin
        }
    });

    updateButtonMargin(); // Call function to update button margin when a reminder is added
}*/

/*
function updateButtonMargin() {
    var button = document.querySelector("button");
    var listElement = document.querySelectorAll(".list-element");
    var hasListElement = listElement.length > 0;

    switch (hasListElement) {
        case true:
            button.style.marginBottom = "1em";
            break;
        case false:
            button.style.marginBottom = "0";
            break;
    }
}*/


