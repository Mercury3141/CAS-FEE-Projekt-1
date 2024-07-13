const express = require('express');
const router = express.Router();
const groupStore = require('../services/group-store');

router.post('/groups', (req, res) => {
    const groupsData = req.body;
    groupStore.saveGroupsData(groupsData)
        .then(() => res.json({ success: true, groupsData: groupsData }))
        .catch(err => res.status(500).json({ success: false, error: err.message }));
});

module.exports = router;
