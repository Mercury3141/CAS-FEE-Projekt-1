const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const dataFilePath = path.join(__dirname, '../public/scripts/model/data.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/api/list-groups', (req, res) => {
    console.log('GET /api/list-groups');
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            return res.status(500).json({ error: 'Failed to read data file' });
        }
        res.json(JSON.parse(data));
    });
});

app.post('/api/list-groups', (req, res) => {
    console.log('POST /api/list-groups', req.body);
    const listGroups = req.body;

    fs.writeFile(dataFilePath, JSON.stringify(listGroups, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Error saving data:', err);
            return res.status(500).json({ error: 'Failed to save data' });
        }
        res.status(200).json({ message: 'Data saved successfully' });
    });
});

app.put('/api/list-groups/:id', (req, res) => {
    const listGroupId = parseInt(req.params.id, 10);
    const updatedListGroup = req.body;
    console.log(`PUT /api/list-groups/${listGroupId}`, updatedListGroup);

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            return res.status(500).json({ error: 'Failed to read data file' });
        }

        let listGroups = JSON.parse(data);
        listGroups = listGroups.map(group => group.id === listGroupId ? updatedListGroup : group);

        fs.writeFile(dataFilePath, JSON.stringify(listGroups, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error updating data:', err);
                return res.status(500).json({ error: 'Failed to update data' });
            }
            res.status(200).json({ message: 'Data updated successfully' });
        });
    });
});

app.delete('/api/list-groups/:id', (req, res) => {
    const listGroupId = parseInt(req.params.id, 10);
    console.log(`DELETE /api/list-groups/${listGroupId}`);

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            return res.status(500).json({ error: 'Failed to read data file' });
        }

        let listGroups = JSON.parse(data);
        listGroups = listGroups.filter(group => group.id !== listGroupId);

        fs.writeFile(dataFilePath, JSON.stringify(listGroups, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error deleting data:', err);
                return res.status(500).json({ error: 'Failed to delete data' });
            }
            res.status(200).json({ message: 'Data deleted successfully' });
        });
    });
});

module.exports = { app };
