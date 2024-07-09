import { saveGroup, getGroups } from '../services/group-store.js';

export async function createGroup(req, res) {
    try {
        const newGroup = await saveGroup(req.body);
        console.log('Group created:', newGroup);
        res.status(201).json(newGroup);
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ error: error.message });
    }
}

export async function fetchGroups(req, res) {
    try {
        const groups = await getGroups();
        console.log('Groups fetched:', groups);
        res.status(200).json(groups);
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ error: error.message });
    }
}
