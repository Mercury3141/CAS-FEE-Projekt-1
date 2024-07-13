const express = require('express');
const router = express.Router();
const groupStore = require('../services/group-store');

router.post('/groups', (req, res) => {
    const data = req.body;
    groupStore.saveData(data)
        .then(() => res.json({ success: true, data: data }))
        .catch(err => res.status(500).json({ success: false, error: err.message }));
});

router.get('/groups', (req, res) => {
    groupStore.loadData()
        .then(data => res.json(data))
        .catch(err => res.status(500).json({ success: false, error: err.message }));
});

module.exports = router;
