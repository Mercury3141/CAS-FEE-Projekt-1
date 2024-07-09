import db from '../../services/database.js';

export function saveGroup(group) {
    return new Promise((resolve, reject) => {
        db.groups.insert(group, (err, newDoc) => {
            if (err) {
                console.error('Error saving group:', err);
                reject(err);
            } else {
                console.log('Group saved:', newDoc);
                resolve(newDoc);
            }
        });
    });
}

export function getGroups() {
    return new Promise((resolve, reject) => {
        db.groups.find({}, (err, docs) => {
            if (err) {
                console.error('Error retrieving groups:', err);
                reject(err);
            } else {
                console.log('Groups retrieved:', docs);
                resolve(docs);
            }
        });
    });
}
