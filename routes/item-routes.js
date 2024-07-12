import express from 'express';
import ItemController from '../controllers/item-controller.js';

const router = express.Router();

// Define routes for item operations within a group
router.get('/groups/:groupId/items', (req, res) => ItemController.getItems(req, res));
router.post('/groups/:groupId/items', (req, res) => ItemController.createItem(req, res));
router.put('/groups/:groupId/items/:itemId', (req, res) => ItemController.updateItem(req, res));
router.delete('/groups/:groupId/items/:itemId', (req, res) => ItemController.deleteItem(req, res));

export default router;
