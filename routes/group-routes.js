import express from 'express';
import { groupController } from '../controllers/group-controller.js';

const router = express.Router();

// Define routes for group operations
router.get('/groups', (req, res) => groupController.getGroups(req, res));
router.post('/groups', (req, res) => groupController.createGroup(req, res));
router.put('/groups/:id', (req, res) => groupController.updateGroup(req, res));
router.delete('/groups/:id', (req, res) => groupController.deleteGroup(req, res));

export default router;
