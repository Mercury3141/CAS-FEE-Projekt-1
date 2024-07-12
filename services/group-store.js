const { groupsDB } = require('./database');

class GroupStore {
    async getAllGroups() {
        return new Promise((resolve, reject) => {
            groupsDB.find({}, (err, docs) => {
                if (err) reject(err);
                else resolve(docs);
            });
        });
    }

    async addGroup(group) {
        return new Promise((resolve, reject) => {
            groupsDB.insert(group, (err, newDoc) => {
                if (err) reject(err);
                else resolve(newDoc);
            });
        });
    }

    async deleteGroup(groupId) {
        return new Promise((resolve, reject) => {
            groupsDB.remove({ _id: groupId }, {}, (err, numRemoved) => {
                if (err) reject(err);
                else resolve(numRemoved);
            });
        });
    }

    async updateGroup(groupId, updatedGroup) {
        return new Promise((resolve, reject) => {
            groupsDB.update({ _id: groupId }, { $set: updatedGroup }, {}, (err, numUpdated) => {
                if (err) reject(err);
                else resolve(numUpdated);
            });
        });
    }
}

module.exports = GroupStore;
