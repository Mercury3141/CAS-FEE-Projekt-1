const ItemModel = require('../models/item-model.js');
const itemModel = new ItemModel();

class ItemController {
    async getItems(req, res) {
        try {
            const items = await itemModel.getItemsByGroupId(req.params.groupId);
            res.json(items);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createItem(req, res) {
        try {
            const newItem = await itemModel.createItem(req.params.groupId, req.body);
            res.json(newItem);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateItem(req, res) {
        try {
            const updatedItem = await itemModel.updateItem(req.params.groupId, req.params.itemId, req.body);
            res.json(updatedItem);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteItem(req, res) {
        try {
            await itemModel.deleteItem(req.params.groupId, req.params.itemId);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ItemController();
