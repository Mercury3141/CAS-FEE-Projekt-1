const GroupModel = require('../models/group-model.js');
const groupModel = new GroupModel();

class GroupController {
    async getGroups(req, res) {
        try {
            const groups = await groupModel.getAllGroups();
            console.log('Sending groups:', groups);  // Add this line for debugging
            res.json(groups);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createGroup(req, res) {
        try {
            const newGroup = await groupModel.createGroup(req.body);
            res.json(newGroup);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateGroup(req, res) {
        try {
            const updatedGroup = await groupModel.updateGroup(req.params.id, req.body);
            res.json(updatedGroup);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteGroup(req, res) {
        try {
            await groupModel.deleteGroup(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new GroupController();
