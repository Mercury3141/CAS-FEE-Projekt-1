import express from 'express';
import groupController from '../controller/group-controller.js';

const router = express.Router();

router.use('/', groupController);

export default router;
