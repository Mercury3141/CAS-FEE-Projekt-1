import express from 'express';
import GroupController from '../controllers/group-controller.js';

const router = express.Router();

// Define routes for group operations
router.get('/groups', (req, res) => GroupController.getGroups(req, res));
router.post('/groups', (req, res) => GroupController.createGroup(req, res));
router.put('/groups/:id', (req, res) => GroupController.updateGroup(req, res));
router.delete('/groups/:id', (req, res) => GroupController.deleteGroup(req, res));

export default router;
