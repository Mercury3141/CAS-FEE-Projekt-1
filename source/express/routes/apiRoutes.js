const express = require('express');
const router = express.Router();
const listGroupController = require('../controllers/listGroupController');

router.get('/list-groups', listGroupController.getListGroups);
router.post('/list-groups', listGroupController.createListGroup);
router.put('/list-groups/:id', listGroupController.updateListGroup);
router.delete('/list-groups/:id', listGroupController.deleteListGroup);

module.exports = router;
