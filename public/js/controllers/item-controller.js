// item-controller.js

import itemService from '../services/item-service.js';

class ItemController {
    async createGroup(req, res) {
        try {
            const groupData = req.body;
            const createdGroup = await itemService.createGroup(groupData);
            res.status(201).json(createdGroup);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getGroups(req, res) {
        try {
            const groups = await itemService.getGroups();
            res.status(200).json(groups);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getGroup(req, res) {
        try {
            const { id } = req.params;
            const group = await itemService.getGroup(id);
            res.status(200).json(group);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateGroup(req, res) {
        try {
            const { id } = req.params;
            const groupData = req.body;
            const updatedGroup = await itemService.updateGroup(id, groupData);
            res.status(200).json(updatedGroup);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteGroup(req, res) {
        try {
            const { id } = req.params;
            await itemService.deleteGroup(id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default new ItemController();
