import ItemStore from '../services/item-store.js';

class AppController {
    static async createGroup(req, res) {
        try {
            const group = req.body;
            const savedGroup = await ItemStore.addGroup(group);
            res.status(201).json(savedGroup);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create group' });
        }
    }
}

export default AppController;
