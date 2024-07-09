import express from 'express';
import { saveGroup, getGroups } from '../public/js/services/group-service.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const newGroup = await saveGroup(req.body);
        console.log('Group saved:', newGroup);
        res.status(201).json(newGroup);
    } catch (error) {
        console.error('Error saving group:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const groups = await getGroups();
        console.log('Groups retrieved:', groups);
        res.status(200).json(groups);
    } catch (error) {
        console.error('Error retrieving groups:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
