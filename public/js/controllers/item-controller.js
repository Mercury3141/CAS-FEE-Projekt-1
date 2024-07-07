const itemService = require('../services/item-service'); // Adjust the path if necessary

module.exports = {
    createItem: (req, res) => {
        const newItem = req.body;
        itemService.createItem(newItem)
            .then(item => res.status(201).json(item))
            .catch(err => res.status(500).json({ error: err.message }));
    },
};
