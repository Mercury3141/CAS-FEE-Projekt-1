const items = []; // This is a temporary in-memory storage. Replace with your actual database logic.

module.exports = {
    saveItem: (newItem) => {
        newItem.id = items.length + 1; // Simple ID assignment. Use proper ID generation in a real app.
        items.push(newItem);
        return newItem;
    },

    getItems: () => {
        return items;
    },

    getItemById: (id) => {
        return items.find(item => item.id === id);
    },

    updateItem: (id, updatedData) => {
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updatedData };
            return items[index];
        }
        return null;
    },

    deleteItem: (id) => {
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items.splice(index, 1);
            return true;
        }
        return false;
    }
};
