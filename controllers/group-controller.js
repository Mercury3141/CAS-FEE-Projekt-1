import express from 'express';
import {GroupStore} from '../services/group-store.js';

const router = express.Router();
const groupStore = new GroupStore();

router.get('/groups', async (req, res) => {
    try {
        const groups = await groupStore.getAllGroups();
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.post('/groups', async (req, res) => {
    try {
        const group = req.body;
        await groupStore.addGroup(group);
        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.put('/groups/:groupId', async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const updatedGroup = req.body;
        await groupStore.updateGroup(groupId, updatedGroup);
        res.status(200).json(updatedGroup);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.delete('/groups/:groupId', async (req, res) => {
    try {
        const groupId = req.params.groupId;
        await groupStore.deleteGroup(groupId);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

export default router;
