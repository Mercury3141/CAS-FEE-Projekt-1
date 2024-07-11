export class ItemService {
    constructor() {
        this.items = [];
        this.nextId = 1;
    }

    async getItemsByGroupId(groupId) {
        return this.items.filter(item => item.groupId === groupId);
    }

    async createItem(groupId) {
        const newItem = {id: this.nextId++, groupId: groupId, description: 'New Item'};
        this.items.push(newItem);
        return newItem;
    }

    async deleteItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
    }

    async deleteItemsByGroupId(groupId) {
        this.items = this.items.filter(item => item.groupId !== groupId);
    }

    async updateItem(itemId, updatedItem) {
        const itemIndex = this.items.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            this.items[itemIndex] = {...this.items[itemIndex], ...updatedItem};
        }
    }
}
