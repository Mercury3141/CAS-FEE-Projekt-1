import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, '../data/data.json');

// Helper function to read data from the JSON file
const readData = () => {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
};

// Helper function to write data to the JSON file
const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
};

// Route to get all groups
router.get('/groups', (req, res) => {
    const data = readData();
    res.json({ groups: data.groups, items: data.items });
});

// Route to create a new group
router.post('/groups', (req, res) => {
    const data = readData();
    const newGroup = { ...req.body, id: Date.now() }; // Generate a unique ID
    data.groups.push(newGroup);
    writeData(data);
    res.json(newGroup);
});

export default router;
