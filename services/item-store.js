import Datastore from 'nedb-promises'

export class Item {
    constructor(value, importance, date) {
        this.checked = false;
        this.value = value || null;
        this.importance = importance === "!!" ? "!!" : null;
        this.date = date ? new Date(date) : null;
    }
}

export class Group {
    constructor(value, importance, date) {
        this.checked = false;
        this.value = value || null;
        this.items = [];
    }
}

const Datastore = require('nedb');

export class GroupStore {
    constructor(db) {
        const options = process.env.DB_TYPE === "FILE" ? { filename: './data/groups.db', autoload: true } : {};
        this.db = db || new Datastore(options);
    }

    async get(id) {
        return new Promise((resolve, reject) => {
            this.db.findOne({ _id: id }, (err, doc) => {
                if (err) return reject(err);
                resolve(doc);
            });
        });
    }

    async all() {
        return new Promise((resolve, reject) => {
            this.db.find({}).sort({ dataOrder: 1 }).exec((err, docs) => {
                if (err) return reject(err);
                resolve(docs);
            });
        });
    }

    async add(name, dataOrder) {
        const group = new Group(name, dataOrder);
        return new Promise((resolve, reject) => {
            this.db.insert(group, (err, newDoc) => {
                if (err) return reject(err);
                resolve(newDoc);
            });
        });
    }

    async addItemToGroup(groupId, value, importance, date) {
        return new Promise((resolve, reject) => {
            this.get(groupId).then(group => {
                if (group) {
                    const item = new Item(value, importance, date);
                    group.items.push(item);
                    this.db.update({ _id: groupId }, { $set: { items: group.items } }, {}, (err) => {
                        if (err) return reject(err);
                        resolve(group);
                    });
                } else {
                    reject(new Error('Group not found'));
                }
            }).catch(reject);
        });
    }

    async delete(id) {
        return new Promise((resolve, reject) => {
            this.db.update({ _id: id }, { $set: { "state": "DELETED" } }, {}, (err, numReplaced) => {
                if (err) return reject(err);
                this.get(id).then(resolve).catch(reject);
            });
        });
    }

    async update(id, { name, importance, date, dataOrder }) {
        return new Promise((resolve, reject) => {
            const updateData = { value: name };
            if (importance !== undefined) updateData.importance = importance === "!!" ? "!!" : null;
            if (date !== undefined) updateData.date = date ? new Date(date) : null;
            if (dataOrder !== undefined) updateData.dataOrder = dataOrder;
            this.db.update({ _id: id }, { $set: updateData }, {}, (err, numReplaced) => {
                if (err) return reject(err);
                this.get(id).then(resolve).catch(reject);
            });
        });
    }
}

export const itemStore = new ItemStore();
