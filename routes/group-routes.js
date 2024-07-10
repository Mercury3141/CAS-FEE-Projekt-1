import express from 'express';
import groupController from '../controller/group-controller.js';

const router = express.Router();

// Use the group controller for group-related routes
router.use('/', groupController);

export default router;
