import express from 'express';
const router = express.Router();
import itemController from '../public/js/controllers/item-controller.js';

router.post('/groups', itemController.createGroup);
router.get('/groups', itemController.getGroups);
router.get('/groups/:id', itemController.getGroup);
router.put('/groups/:id', itemController.updateGroup);
router.delete('/groups/:id', itemController.deleteGroup);

export default router;
