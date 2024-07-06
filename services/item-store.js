import Datastore from 'nedb-promises'

export class Item {
    constructor(pizzaName, orderedBy) {
        this.orderedBy = orderedBy;
        this.pizzaName = pizzaName;
        this.orderDate = new Date();
        this.state = "OK";
    }
}

export class ItemStore {
    constructor(db) {
        const options = process.env.DB_TYPE === "FILE" ? {filename: './data/items.db', autoload: true} : {}
        this.db = db || new Datastore(options);
    }

    async add(pizzaName, orderedBy) {
        let order = new Order(pizzaName, orderedBy);
        return this.db.insert(order);
    }

    async delete(id) {
        await this.db.update({_id: id}, {$set: {"state": "DELETED"}});
        return this.get(id, currentUser);
    }

    async get(id) {
        return this.db.findOne({_id: id});
    }


}

export const itemStore = new ItemStore();
