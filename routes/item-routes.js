import { Router } from 'express';
import AppController from '../controller/app-controller.js';

const router = Router();

router.post('/api/groups', AppController.createGroup);

export default router;
