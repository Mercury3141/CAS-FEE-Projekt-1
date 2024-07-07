import { Router } from 'express';
const router = Router();

// Define general routes here
router.get('/', (req, res) => {
    res.send('API is working');
});

export default router;
