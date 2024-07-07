const itemStore = require('../../../services/item-store'); // Adjust the path relative to the current file

module.exports = {
    createItem: (newItem) => {
        // Logic to create an item
        return new Promise((resolve, reject) => {
            try {
                const createdItem = itemStore.saveItem(newItem);
                resolve(createdItem);
            } catch (error) {
                reject(error);
            }
        });
    },

    getItems: () => {
        // Logic to get all items
        return new Promise((resolve, reject) => {
            try {
                const items = itemStore.getItems();
                resolve(items);
            } catch (error) {
                reject(error);
            }
        });
    },

    getItemById: (id) => {
        // Logic to get a single item by ID
        return new Promise((resolve, reject) => {
            try {
                const item = itemStore.getItemById(id);
                if (item) {
                    resolve(item);
                } else {
                    reject(new Error('Item not found'));
                }
            } catch (error) {
                reject(error);
            }
        });
    },

    updateItem: (id, updatedData) => {
        // Logic to update an item
        return new Promise((resolve, reject) => {
            try {
                const updatedItem = itemStore.updateItem(id, updatedData);
                if (updatedItem) {
                    resolve(updatedItem);
                } else {
                    reject(new Error('Item not found'));
                }
            } catch (error) {
                reject(error);
            }
        });
    },

    deleteItem: (id) => {
        // Logic to delete an item
        return new Promise((resolve, reject) => {
            try {
                const deleted = itemStore.deleteItem(id);
                if (deleted) {
                    resolve();
                } else {
                    reject(new Error('Item not found'));
                }
            } catch (error) {
                reject(error);
            }
        });
    }
};
