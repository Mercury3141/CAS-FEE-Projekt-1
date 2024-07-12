const fileService = require('../services/file-service.js');

class ItemModel {
    async getItemsByGroupId(groupId) {
        const data = await fileService.readData();
        return data.items.filter(item => item.groupId === groupId);
    }

    async createItem(groupId, item) {
        const data = await fileService.readData();
        item.id = Date.now();
        item.groupId = groupId;
        data.items.push(item);
        await fileService.writeData(data);
        return item;
    }

    async updateItem(groupId, itemId, updatedItem) {
        const data = await fileService.readData();
        const itemIndex = data.items.findIndex(item => item.id === itemId && item.groupId === groupId);
        if (itemIndex !== -1) {
            data.items[itemIndex] = { ...data.items[itemIndex], ...updatedItem };
            await fileService.writeData(data);
            return data.items[itemIndex];
        }
        throw new Error('Item not found');
    }

    async deleteItem(groupId, itemId) {
        const data = await fileService.readData();
        data.items = data.items.filter(item => item.id !== itemId || item.groupId !== groupId);
        await fileService.writeData(data);
    }
}

module.exports = new ItemModel();
