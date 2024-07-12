import Database from './database.js';

class ItemStore {
    async getItemsByGroupId(groupId) {
        const data = await Database.readData();
        return data.items.filter(item => item.groupId === groupId);
    }

    async createItem(groupId, item) {
        const data = await Database.readData();
        item.id = Date.now(); // Simple unique ID generation
        item.groupId = groupId;
        data.items.push(item);
        await Database.writeData(data);
        return item;
    }

    async updateItem(groupId, itemId, updatedItem) {
        const data = await Database.readData();
        const itemIndex = data.items.findIndex(item => item.id === itemId && item.groupId === groupId);
        if (itemIndex !== -1) {
            data.items[itemIndex] = { ...data.items[itemIndex], ...updatedItem };
            await Database.writeData(data);
            return data.items[itemIndex];
        }
        throw new Error('Item not found');
    }

    async deleteItem(groupId, itemId) {
        const data = await Database.readData();
        data.items = data.items.filter(item => item.id !== itemId || item.groupId !== groupId);
        await Database.writeData(data);
    }
}

export default new ItemStore();
