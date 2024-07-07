import { Router } from 'express';
const router = Router();

// Define item-specific routes here
router.get('/', (req, res) => {
    res.send('Item API is working');
});

export default router;
