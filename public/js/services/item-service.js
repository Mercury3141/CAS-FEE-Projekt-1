import db from '../../../services/database.js';  // Adjust the path to the correct location

export function saveItem(item) {
    return new Promise((resolve, reject) => {
        db.items.insert(item, (err, newDoc) => {
            if (err) {
                console.error('Error saving item:', err);
                reject(err);
            } else {
                console.log('Item saved:', newDoc);
                resolve(newDoc);
            }
        });
    });
}

export function getItems() {
    return new Promise((resolve, reject) => {
        db.items.find({}, (err, docs) => {
            if (err) {
                console.error('Error retrieving items:', err);
                reject(err);
            } else {
                console.log('Items retrieved:', docs);
                resolve(docs);
            }
        });
    });
}
