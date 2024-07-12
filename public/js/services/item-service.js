const ItemStore = require('../stores/item-store.js');

class ItemService {
    constructor() {
        this.itemStore = new ItemStore();
    }

    async getItemsByGroupId(groupId) {
        return await this.itemStore.getItemsByGroupId(groupId);
    }

    async createItem(groupId, description) {
        const newItem = { id: Date.now().toString(), groupId, description, dueDate: '', important: false };
        await this.itemStore.addItem(newItem);
        return newItem;
    }

    async deleteItem(itemId) {
        await this.itemStore.deleteItem(itemId);
    }

    async updateItem(itemId, updatedItem) {
        await this.itemStore.updateItem(itemId, updatedItem);
    }

    async deleteItemsByGroupId(groupId) {
        await this.itemStore.deleteItemsByGroupId(groupId);
    }
}

module.exports = ItemService;
