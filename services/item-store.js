import { promises as fs } from 'fs';

const itemsFilePath = './data/items.db';

export class ItemStore {
    async getItemsByGroupId(groupId) {
        const data = await fs.readFile(itemsFilePath, 'utf-8');
        const items = JSON.parse(data);
        return items.filter(item => item.groupId === groupId);
    }

    async saveItems(items) {
        await fs.writeFile(itemsFilePath, JSON.stringify(items, null, 2), 'utf-8');
    }

    async addItem(item) {
        const items = await this.getItems();
        items.push(item);
        await this.saveItems(items);
    }

    async deleteItem(itemId) {
        let items = await this.getItems();
        items = items.filter(item => item.id !== itemId);
        await this.saveItems(items);
    }
}
