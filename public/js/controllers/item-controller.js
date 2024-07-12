import itemService from '../services/item-service.js';

class ItemController {
    constructor(groupId) {
        this.groupId = groupId;
        this.init();
    }

    async init() {
        await this.loadItems();
        const addItemButton = document.getElementById(`add-item-${this.groupId}`);
        if (addItemButton) {
            addItemButton.addEventListener('click', () => this.addItem());
        } else {
            console.error(`Element with ID add-item-${this.groupId} not found`);
        }
    }

    async loadItems() {
        const items = await itemService.getItems(this.groupId);
        this.renderItems(items);
    }

    async addItem() {
        const newItem = await itemService.createItem(this.groupId, { description: 'New Item' });
        this.renderItem(newItem);
    }

    renderItems(items) {
        const template = document.getElementById('item-template').innerHTML;
        const compiledTemplate = Handlebars.compile(template);
        const itemList = document.getElementById(`item-list-${this.groupId}`);
        itemList.innerHTML = items.map(item => compiledTemplate(item)).join('');
    }

    renderItem(item) {
        const template = document.getElementById('item-template').innerHTML;
        const compiledTemplate = Handlebars.compile(template);
        const itemList = document.getElementById(`item-list-${this.groupId}`);
        itemList.innerHTML += compiledTemplate(item);
    }
}

export default ItemController;
