const listGroupService = require('../services/listGroupService');

exports.getListGroups = async (req, res) => {
    try {
        const listGroups = await listGroupService.getListGroups();
        res.json(listGroups);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get list groups' });
    }
};

exports.createListGroup = async (req, res) => {
    try {
        const listGroup = await listGroupService.createListGroup(req.body);
        res.status(201).json(listGroup);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create list group' });
    }
};

exports.updateListGroup = async (req, res) => {
    try {
        const listGroup = await listGroupService.updateListGroup(req.params.id, req.body);
        res.json(listGroup);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update list group' });
    }
};

exports.deleteListGroup = async (req, res) => {
    try {
        await listGroupService.deleteListGroup(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete list group' });
    }
};
