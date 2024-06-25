export const listGroupTemplate = `
<div class="list-group" data-id="{{id}}">
    <div class="list-group-header">
        <input type="checkbox" id="group-checkbox-{{id}}">
        <span class="editable-label group-title text-font text-title {{#unless userInputted}}inactive-label{{/unless}}" id="group-title-{{id}}" contenteditable="false">{{title}}</span>
    </div>
    <button data-action="create-reminder" data-group-id="{{id}}">+</button>
    <div class="reminders-container" id="reminders-container-{{id}}"></div>
</div>
`;

export const reminderTemplate = `
<div class="checkbox-container" data-id="{{id}}">
    <input type="checkbox" id="checkbox-{{id}}">
    <span class="editable-label text-font text-list {{#unless userInputted}}inactive-label{{/unless}}" id="label-{{id}}" contenteditable="false">{{text}}</span>
    <div class="spacer-fill"></div>
    <button id="button-{{id}}" data-action="toggle-important" class="{{#if important}}important{{/if}}">!</button>
    <input class="date-input" type="date" id="date-{{id}}">
</div>
`;
