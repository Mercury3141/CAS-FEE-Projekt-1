import fs from 'fs';
import path from 'path';
import Datastore from 'nedb';

// Define the paths to the database files
const groupsDbPath = path.resolve('./data/groups.db');
const itemsDbPath = path.resolve('./data/items.db');

// Check if the database directory exists, create if not
const dataDir = path.resolve('./data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Check file permissions
function checkFilePermissions(filePath) {
    try {
        fs.accessSync(filePath, fs.constants.R_OK | fs.constants.W_OK);
        console.log(`${filePath} is readable and writable.`);
    } catch (err) {
        console.error(`${filePath} is not accessible.`, err);
    }
}

// Perform permission checks
checkFilePermissions(groupsDbPath);
checkFilePermissions(itemsDbPath);

// Initialize the databases
const db = {};
db.groups = new Datastore({ filename: groupsDbPath, autoload: true });
db.items = new Datastore({ filename: itemsDbPath, autoload: true });

export default db;
