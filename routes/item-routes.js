const express = require('express');
const router = express.Router();
const itemController = require('../public/js/controllers/item-controller'); // Adjust the path if necessary

router.post('/items', itemController.createItem); // Ensure createItem is defined in item-controller

// Example of adding other routes
// router.get('/items', itemController.getItems);

module.exports = router;
