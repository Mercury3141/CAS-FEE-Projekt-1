import express from 'express';
import itemController from '../controller/item-controller.js';

const router = express.Router();

router.use('/', itemController);

export default router;
