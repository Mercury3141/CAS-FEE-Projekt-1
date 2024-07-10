import express from 'express';
import itemController from '../controller/item-controller.js';

const router = express.Router();

// Use the item controller for item-related routes
router.use('/', itemController);

export default router;
