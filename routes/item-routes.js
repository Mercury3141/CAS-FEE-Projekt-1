const express = require('express');
const router = express.Router();
const itemStore = require('../services/item-store');

router.get('/', (req, res) => {
    itemStore.loadData()
        .then(data => res.json(data))
        .catch(err => res.status(500).json({ success: false, error: err.message }));
});

router.post('/', (req, res) => {
    const newItem = req.body;
    itemStore.loadData()
        .then(data => {
            data.items.push(newItem);
            return itemStore.saveData(data);
        })
        .then(() => res.json({ success: true, data: newItem }))
        .catch(err => res.status(500).json({ success: false, error: err.message }));
});

router.get('/:id', (req, res) => {
    itemStore.loadData()
        .then(data => {
            const item = data.items.find(i => i.id === Number(req.params.id));
            if (item) {
                res.json(item);
            } else {
                res.status(404).json({ success: false, error: 'Item not found' });
            }
        })
        .catch(err => res.status(500).json({ success: false, error: err.message }));
});

router.put('/:id', (req, res) => {
    const itemId = Number(req.params.id);
    itemStore.loadData()
        .then(data => {
            const item = data.items.find(i => i.id === itemId);
            if (item) {
                Object.assign(item, req.body);
                return itemStore.saveData(data);
            } else {
                return res.status(404).json({ success: false, error: 'Item not found' });
            }
        })
        .then(() => res.json({ success: true }))
        .catch(err => res.status(500).json({ success: false, error: err.message }));
});

router.delete('/:id', (req, res) => {
    const itemId = Number(req.params.id);
    itemStore.loadData()
        .then(data => {
            const index = data.items.findIndex(i => i.id === itemId);
            if (index !== -1) {
                data.items.splice(index, 1);
                return itemStore.saveData(data);
            } else {
                return res.status(404).json({ success: false, error: 'Item not found' });
            }
        })
        .then(() => res.json({ success: true }))
        .catch(err => res.status(500).json({ success: false, error: err.message }));
});

module.exports = router;
