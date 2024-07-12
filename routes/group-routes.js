const express = require('express');
const GroupController = require('../controllers/group-controller.js');
const groupController = new GroupController();

const router = express.Router();

// Define routes for group operations
router.get('/groups', groupController.getGroups);
router.post('/groups', groupController.createGroup);
router.put('/groups/:id', groupController.updateGroup);
router.delete('/groups/:id', groupController.deleteGroup);

module.exports = router;
