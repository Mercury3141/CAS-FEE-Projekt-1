import Datastore from 'nedb';

const db = {};
db.groups = new Datastore({ filename: './data/groups.db', autoload: true });
db.items = new Datastore({ filename: './data/items.db', autoload: true });

export default db;
