// public/js/services/group-service.js

export class GroupService {
    constructor() {
        this.groupContainer = document.getElementById('group-list');
        this.groupTemplate = Handlebars.compile(document.getElementById('group-template').innerHTML);
        this.groupId = 0;
    }

    addGroup() {
        const groupData = {
            id: this.groupId++,
            order: this.groupContainer.children.length
        };
        const groupHtml = this.groupTemplate(groupData);
        this.groupContainer.insertAdjacentHTML('beforeend', groupHtml);
    }
}
