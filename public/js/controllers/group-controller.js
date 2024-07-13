const express = require('express');
const router = express.Router();
const groupStore = require('../../services/group-store'); // Updated path to resolve correctly
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.get('/groups', (req, res) => {
    groupStore.loadData()
        .then(data => res.json(data))
        .catch(err => res.status(500).json({ success: false, error: err.message }));
});

router.post('/groups', (req, res) => {
    const data = req.body;
    groupStore.saveData(data)
        .then(() => res.json({ success: true, data: data }))
        .catch(err => res.status(500).json({ success: false, error: err.message }));
});

// Helper function to find group by ID
function findGroupById(groups, id) {
    return groups.find(g => g.id === id);
}

// Helper function to validate group data
function validateGroupData(group) {
    return typeof group.id === 'number' &&
        typeof group.order === 'number' &&
        typeof group.checked === 'boolean' &&
        typeof group.textContent === 'string';
}

router.get('/groups/:id', (req, res) => {
    groupStore.loadData()
        .then(data => {
            const group = findGroupById(data.groups, Number(req.params.id));
            if (group) {
                res.json(group);
            } else {
                res.status(404).json({ success: false, error: 'Group not found' });
            }
        })
        .catch(err => res.status(500).json({ success: false, error: err.message }));
});

router.put('/groups/:id', (req, res) => {
    const groupId = Number(req.params.id);
    groupStore.loadData()
        .then(data => {
            const group = findGroupById(data.groups, groupId);
            if (group) {
                Object.assign(group, req.body);
                if (!validateGroupData(group)) {
                    return res.status(400).json({ success: false, error: 'Invalid group data' });
                }
                return groupStore.saveData(data);
            } else {
                return res.status(404).json({ success: false, error: 'Group not found' });
            }
        })
        .then(() => res.json({ success: true }))
        .catch(err => res.status(500).json({ success: false, error: err.message }));
});

router.delete('/groups/:id', (req, res) => {
    const groupId = Number(req.params.id);
    groupStore.loadData()
        .then(data => {
            const index = data.groups.findIndex(g => g.id === groupId);
            if (index !== -1) {
                data.groups.splice(index, 1);
                return groupStore.saveData(data);
            } else {
                return res.status(404).json({ success: false, error: 'Group not found' });
            }
        })
        .then(() => res.json({ success: true }))
        .catch(err => res.status(500).json({ success: false, error: err.message }));
});

module.exports = router;
