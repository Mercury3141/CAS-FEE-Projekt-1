import db from './database.js';

export function saveGroup(group) {
    return new Promise((resolve, reject) => {
        db.groups.insert(group, (err, newDoc) => {
            if (err) {
                console.error('Error saving group:', err);
                reject(new Error('Failed to save group.'));
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
                reject(new Error('Failed to retrieve groups.'));
            } else {
                console.log('Groups retrieved:', docs);
                resolve(docs);
            }
        });
    });
}
