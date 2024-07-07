const itemStore = require('../../../services/item-store'); // Adjust the path if necessary

module.exports = {
    createGroup: (newGroup) => {
        return new Promise((resolve, reject) => {
            try {
                const createdGroup = itemStore.saveGroup(newGroup);
                resolve(createdGroup);
            } catch (error) {
                reject(error);
            }
        });
    },
    // Add other functions similarly
};
