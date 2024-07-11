import Datastore from 'nedb';
import fs from 'fs';
import path from 'path';

const groupsDbPath = path.resolve('./data/groups.db');
const itemsDbPath = path.resolve('./data/items.db');

const dataDir = path.resolve('./data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

function checkFilePermissions(filePath) {
    try {
        fs.accessSync(filePath, fs.constants.R_OK | fs.constants.W_OK);
        console.log(`${filePath} is readable and writable.`);
    } catch (err) {
        console.error(`${filePath} is not accessible.`, err);
    }
}

checkFilePermissions(groupsDbPath);
checkFilePermissions(itemsDbPath);

const db = {};
db.groups = new Datastore({filename: groupsDbPath, autoload: true});
db.items = new Datastore({filename: itemsDbPath, autoload: true});

export default db;
