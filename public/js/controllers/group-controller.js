import GroupStore from '../services/group-store.js';

class GroupController {
    async getGroups(req, res) {
        try {
            const groups = await GroupStore.getAllGroups();
            res.json(groups);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createGroup(req, res) {
        try {
            const newGroup = await GroupStore.addGroup(req.body);
            res.json(newGroup);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateGroup(req, res) {
        try {
            const updatedGroup = await GroupStore.updateGroup(req.params.id, req.body);
            res.json(updatedGroup);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteGroup(req, res) {
        try {
            await GroupStore.deleteGroup(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new GroupController();
