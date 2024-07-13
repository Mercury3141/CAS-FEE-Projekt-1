const express = require('express');
const router = express.Router();
const groupStore = require('../services/group-store');

router.post('/groups', (req, res) => {
    const groupId = req.body.id;
    groupStore.saveGroupId(groupId)
        .then(() => res.json({ success: true, id: groupId }))
        .catch(err => res.status(500).json({ success: false, error: err.message }));
});

module.exports = router;
