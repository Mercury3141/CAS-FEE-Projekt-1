const itemService = require('../public/js/services/item-service');

exports.createGroup = (req, res) => {
    const groupData = req.body;
    itemService.createGroup(groupData)
        .then(group => res.status(201).json(group))
        .catch(error => res.status(400).json({ error: error.message }));
};




/*

router.get('/items', (req, res) => {
    ItemStore.getAllItems((err, items) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(items);
    });
});

router.post('/items', (req, res) => {
    const newItem = req.body;
    ItemStore.addItem(newItem, (err, item) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(item);
    });
});

router.put('/items/:id', (req, res) => {
    const id = req.params.id;
    const updatedItem = req.body;
    ItemStore.updateItem(id, updatedItem, (err, numReplaced) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ numReplaced });
    });
});

router.delete('/items/:id', (req, res) => {
    const id = req.params.id;
    ItemStore.deleteItem(id, (err, numRemoved) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ numRemoved });
    });
});

// Group routes
router.get('/groups', (req, res) => {
    ItemStore.getAllGroups((err, groups) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(groups);
    });
});

router.post('/groups', (req, res) => {
    const newGroup = req.body;
    ItemStore.addGroup(newGroup, (err, group) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(group);
    });
});

router.put('/groups/:id', (req, res) => {
    const id = req.params.id;
    const updatedGroup = req.body;
    ItemStore.updateGroup(id, updatedGroup, (err, numReplaced) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ numReplaced });
    });
});

router.delete('/groups/:id', (req, res) => {
    const id = req.params.id;
    ItemStore.deleteGroup(id, (err, numRemoved) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ numRemoved });
    });
});

module.exports = router;*/
