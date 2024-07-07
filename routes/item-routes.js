const express = require('express');
const router = express.Router();
const itemController = require('../public/js/controllers/item-controller');

router.post('/groups', itemController.createGroup);

module.exports = router;
