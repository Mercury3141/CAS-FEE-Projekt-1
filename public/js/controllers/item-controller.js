const itemService = require('../../services/item-service');

module.exports = {
    createGroup: (req, res) => {
        const newGroup = req.body;
        itemService.createGroup(newGroup)
            .then(group => res.status(201).json(group))
            .catch(err => res.status(500).json({ error: err.message }));
    },
    // Add other functions similarly
};
