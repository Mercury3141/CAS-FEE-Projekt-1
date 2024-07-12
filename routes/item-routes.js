const express = require('express');
const ItemStore = require('../services/item-store');

const router = express.Router();
const itemStore = new ItemStore();

router.get('/groups/:groupId/items', async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const items = await itemStore.getItemsByGroupId(groupId);
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/groups/:groupId/items', async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const newItem = { ...req.body, groupId };
        const item = await itemStore.addItem(newItem);
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/items/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        await itemStore.deleteItem(itemId);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/items/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        const updatedItem = req.body;
        await itemStore.updateItem(itemId, updatedItem);
        res.status(200).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/groups/:groupId/items', async (req, res) => {
    try {
        const groupId = req.params.groupId;
        await itemStore.deleteItemsByGroupId(groupId);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
