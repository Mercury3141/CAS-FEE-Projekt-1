import { promises as fs } from 'fs';

const itemsFilePath = './data/items.db';

export class ItemStore {
    async getItemsByGroupId(groupId) {
        const data = await fs.readFile(itemsFilePath, 'utf-8');
        const items = JSON.parse(data);
        return items.filter(item => item.groupId === groupId);
    }

    async getAllItems() {
        const data = await fs.readFile(itemsFilePath, 'utf-8');
        return JSON.parse(data);
    }

    async saveItems(items) {
        await fs.writeFile(itemsFilePath, JSON.stringify(items, null, 2), 'utf-8');
    }

    async addItem(item) {
        const items = await this.getAllItems();
        items.push(item);
        await this.saveItems(items);
    }

    async updateItem(itemId, updatedItem) {
        const items = await this.getAllItems();
        const itemIndex = items.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            items[itemIndex] = { ...items[itemIndex], ...updatedItem };
            await this.saveItems(items);
        }
    }

    async deleteItem(itemId) {
        let items = await this.getAllItems();
        items = items.filter(item => item.id !== itemId);
        await this.saveItems(items);
    }
}
