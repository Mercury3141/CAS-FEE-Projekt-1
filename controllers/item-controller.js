import ItemStore from '../services/item-store.js'; // Ensure the correct path

class ItemController {
    async getItems(req, res) {
        try {
            const items = await ItemStore.getItemsByGroupId(req.params.groupId);
            res.json(items);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createItem(req, res) {
        try {
            const newItem = await ItemStore.createItem(req.params.groupId, req.body);
            res.json(newItem);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateItem(req, res) {
        try {
            const updatedItem = await ItemStore.updateItem(req.params.groupId, req.params.itemId, req.body);
            res.json(updatedItem);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteItem(req, res) {
        try {
            await ItemStore.deleteItem(req.params.groupId, req.params.itemId);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export const itemController = new ItemController();
