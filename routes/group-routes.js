import express from 'express';
import { saveGroup, getGroups } from '../public/js/services/group-service.js';

const router = express.Router();

router.post('/groups', async (req, res) => {
    try {
        const newGroup = await saveGroup(req.body);
        res.status(201).json(newGroup);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/groups', async (req, res) => {
    try {
        const groups = await getGroups();
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
