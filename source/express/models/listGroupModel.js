const fs = require('fs').promises;
const path = require('path');
const dataFilePath = path.join(__dirname, '../data/data.json');

const readData = async () => {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
};

const writeData = async (data) => {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
};

exports.getAll = async () => {
    return await readData();
};

exports.create = async (newGroup) => {
    const listGroups = await readData();
    listGroups.push(newGroup);
    await writeData(listGroups);
    return newGroup;
};

exports.update = async (id, updatedGroup) => {
    const listGroups = await readData();
    const index = listGroups.findIndex(group => group.id === parseInt(id, 10));
    if (index !== -1) {
        listGroups[index] = updatedGroup;
        await writeData(listGroups);
        return updatedGroup;
    } else {
        throw new Error('ListGroup not found');
    }
};

exports.delete = async (id) => {
    let listGroups = await readData();
    listGroups = listGroups.filter(group => group.id !== parseInt(id, 10));
    await writeData(listGroups);
};
