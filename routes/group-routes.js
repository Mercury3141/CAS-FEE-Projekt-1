const express = require('express');
const router = express.Router();
const groupStore = require('../services/group-store');

router.post('/groups', (req, res) => {
    const groupData = req.body;
    groupStore.saveGroupData(groupData)
        .then(() => res.json({ success: true, groupData: groupData }))
        .catch(err => res.status(500).json({ success: false, error: err.message }));
});

module.exports = router;
