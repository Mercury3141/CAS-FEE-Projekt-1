const GroupService = require('../services/group-service.js');
const groupService = new GroupService();

exports.getAllGroups = async (req, res) => {
    try {
        const groups = await groupService.getAllGroups();
        res.json(groups);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.createGroup = async (req, res) => {
    try {
        const { name } = req.body;
        const newGroup = await groupService.createGroup(name);
        res.status(201).json(newGroup);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.deleteGroup = async (req, res) => {
    try {
        const { id } = req.params;
        await groupService.deleteGroup(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.updateGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedGroup = req.body;
        await groupService.updateGroup(id, updatedGroup);
        res.status(200).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
};
