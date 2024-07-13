const express = require('express');
const router = express.Router();
const {
    getAllItems,
    getItemById,
    getItemsByGroupId,
    addItem,
    updateItem,
    deleteItem
} = require('../controllers/item-controller'); // Adjust the path as necessary

router.get('/items', getAllItems);

router.get('/items/:id', getItemById);

router.get('/items/group/:groupId', getItemsByGroupId);

router.post('/items', addItem);

router.put('/items/:id', updateItem);

router.delete('/items/:id', deleteItem);

module.exports = router;
