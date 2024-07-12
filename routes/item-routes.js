import express from 'express';
import { itemController } from '../controllers/item-controller.js';

const router = express.Router();

// Define routes for item operations within a group
router.get('/groups/:groupId/items', (req, res) => itemController.getItems(req, res));
router.post('/groups/:groupId/items', (req, res) => itemController.createItem(req, res));
router.put('/groups/:groupId/items/:itemId', (req, res) => itemController.updateItem(req, res));
router.delete('/groups/:groupId/items/:itemId', (req, res) => itemController.deleteItem(req, res));

export default router;
