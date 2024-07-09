import express from 'express';
import { createGroup, fetchGroups } from '../controllers/group-controller.js';

const router = express.Router();

router.post('/', createGroup);
router.get('/', fetchGroups);

export default router;
