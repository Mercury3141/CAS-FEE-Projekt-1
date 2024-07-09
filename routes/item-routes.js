import express from 'express';
import { saveItem, getItems } from '../public/js/services/item-service.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const newItem = await saveItem(req.body);
        console.log('Item saved:', newItem);
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Error saving item:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const items = await getItems();
        console.log('Items retrieved:', items);
        res.status(200).json(items);
    } catch (error) {
        console.error('Error retrieving items:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
