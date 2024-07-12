const express = require('express');
const itemController = require('../controllers/item-controller.js');

const router = express.Router();

// Define routes for item operations within a group
router.get('/groups/:groupId/items', itemController.getItems);
router.post('/groups/:groupId/items', itemController.createItem);
router.put('/groups/:groupId/items/:itemId', itemController.updateItem);
router.delete('/groups/:groupId/items/:itemId', itemController.deleteItem);

module.exports = router;
