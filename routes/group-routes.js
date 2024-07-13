const express = require('express');
const router = express.Router();
const groupStore = require('../services/group-store');

router.get('/', (req, res) => {
    groupStore.loadData()
        .then(data => res.json(data))
        .catch(err => res.status(500).json({ success: false, error: err.message }));
});

router.post('/', (req, res) => {
    const newGroup = req.body;
    groupStore.loadData()
        .then(data => {
            data.groups.push(newGroup);
            return groupStore.saveData(data);
        })
        .then(() => res.json({ success: true, data: newGroup }))
        .catch(err => res.status(500).json({ success: false, error: err.message }));
});

router.get('/:id', (req, res) => {
    groupStore.loadData()
        .then(data => {
            const group = data.groups.find(g => g.id === Number(req.params.id));
            if (group) {
                res.json(group);
            } else {
                res.status(404).json({ success: false, error: 'Group not found' });
            }
        })
        .catch(err => res.status(500).json({ success: false, error: err.message }));
});

router.put('/:id', (req, res) => {
    const groupId = Number(req.params.id);
    groupStore.loadData()
        .then(data => {
            const group = data.groups.find(g => g.id === groupId);
            if (group) {
                Object.assign(group, req.body);
                return groupStore.saveData(data);
            } else {
                return res.status(404).json({ success: false, error: 'Group not found' });
            }
        })
        .then(() => res.json({ success: true }))
        .catch(err => res.status(500).json({ success: false, error: err.message }));
});

router.delete('/:id', (req, res) => {
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
