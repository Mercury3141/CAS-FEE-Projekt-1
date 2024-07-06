import express from 'express';

const router = express.Router();
import { itemController } from '../controller/item-controller.js';


router.get('/items', itemController.getItems);
router.post('/items', itemController.addItem);


export const indexRoutes = router;
