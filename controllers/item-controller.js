const ItemService = require('../services/item-service.js');
const itemService = new ItemService();

exports.getItemsByGroupId = async (req, res) => {
    try {
        const { groupId } = req.params;
        const items = await itemService.getItemsByGroupId(groupId);
        res.json(items);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.createItem = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { description } = req.body;
        const newItem = await itemService.createItem(groupId, description);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        await itemService.deleteItem(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedItem = req.body;
        await itemService.updateItem(id, updatedItem);
        res.status(200).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.deleteItemsByGroupId = async (req, res) => {
    try {
        const { groupId } = req.params;
        await itemService.deleteItemsByGroupId(groupId);
        res.status(204).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
};
