import itemService from '../services/item-service.js';

class ItemController {
    constructor(groupId, items) {
        this.groupId = groupId;
        this.items = items;
        this.init();
    }

    async init() {
        this.renderItems(this.items);
        const addItemButton = document.getElementById(`add-item-${this.groupId}`);
        if (addItemButton) {
            addItemButton.addEventListener('click', () => this.addItem());
        } else {
            console.error(`Element with ID add-item-${this.groupId} not found`);
        }
    }

    async addItem() {
        try {
            const newItem = await itemService.createItem(this.groupId, { textContent: 'New Item' });
            this.renderItem(newItem);
        } catch (error) {
            console.error('Error adding item:', error);
        }
    }

    renderItems(items) {
        const filteredItems = items.filter(item => item.groupId === this.groupId);
        const template = document.getElementById('item-template').innerHTML;
        const compiledTemplate = Handlebars.compile(template);
        const itemList = document.getElementById(`item-list-${this.groupId}`);
        itemList.innerHTML = filteredItems.map(item => compiledTemplate(item)).join('');
    }

    renderItem(item) {
        const template = document.getElementById('item-template').innerHTML;
        const compiledTemplate = Handlebars.compile(template);
        const itemList = document.getElementById(`item-list-${this.groupId}`);
        itemList.innerHTML += compiledTemplate(item);
    }
}

export default ItemController;
