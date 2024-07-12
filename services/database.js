const Datastore = require('nedb');
const path = require('path');

const groupsDB = new Datastore({ filename: path.join(__dirname, '../data/groups.db'), autoload: true });
const itemsDB = new Datastore({ filename: path.join(__dirname, '../data/items.db'), autoload: true });

module.exports = { groupsDB, itemsDB };
