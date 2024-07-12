const express = require('express');
const GroupStore = require('../services/group-store');

const router = express.Router();
const groupStore = new GroupStore();

router.get('/groups', async (req, res) => {
    try {
        const groups = await groupStore.getAllGroups();
        res.json(groups);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/groups', async (req, res) => {
    try {
        const newGroup = req.body;
        const group = await groupStore.addGroup(newGroup);
        res.status(201).json(group);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/groups/:id', async (req, res) => {
    try {
        const groupId = req.params.id;
        await groupStore.deleteGroup(groupId);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/groups/:id', async (req, res) => {
    try {
        const groupId = req.params.id;
        const updatedGroup = req.body;
        await groupStore.updateGroup(groupId, updatedGroup);
        res.status(200).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
