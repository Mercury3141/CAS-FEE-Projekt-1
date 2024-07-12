const { itemsDB } = require('./database');

class ItemStore {
    async getItemsByGroupId(groupId) {
        return new Promise((resolve, reject) => {
            itemsDB.find({ groupId }, (err, docs) => {
                if (err) reject(err);
                else resolve(docs);
            });
        });
    }

    async addItem(item) {
        return new Promise((resolve, reject) => {
            itemsDB.insert(item, (err, newDoc) => {
                if (err) reject(err);
                else resolve(newDoc);
            });
        });
    }

    async deleteItem(itemId) {
        return new Promise((resolve, reject) => {
            itemsDB.remove({ _id: itemId }, {}, (err, numRemoved) => {
                if (err) reject(err);
                else resolve(numRemoved);
            });
        });
    }

    async deleteItemsByGroupId(groupId) {
        return new Promise((resolve, reject) => {
            itemsDB.remove({ groupId }, { multi: true }, (err, numRemoved) => {
                if (err) reject(err);
                else resolve(numRemoved);
            });
        });
    }

    async updateItem(itemId, updatedItem) {
        return new Promise((resolve, reject) => {
            itemsDB.update({ _id: itemId }, { $set: updatedItem }, {}, (err, numUpdated) => {
                if (err) reject(err);
                else resolve(numUpdated);
            });
        });
    }
}

module.exports = ItemStore;
