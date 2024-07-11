import express from 'express';
import {ItemStore} from '../services/item-store.js';

const router = express.Router();
const itemStore = new ItemStore();

router.get('/groups/:groupId/items', async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const items = await itemStore.getItemsByGroupId(groupId);
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.post('/groups/:groupId/items', async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const item = req.body;
        item.groupId = groupId;
        await itemStore.addItem(item);
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.put('/items/:itemId', async (req, res) => {
    try {
        const itemId = req.params.itemId;
        const updatedItem = req.body;
        await itemStore.updateItem(itemId, updatedItem);
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.delete('/items/:itemId', async (req, res) => {
    try {
        const itemId = req.params.itemId;
        await itemStore.deleteItem(itemId);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

export default router;
