const express = require('express');
const router = express.Router();
const itemController = require('../controller/app-controller');

router.post('/groups', itemController.createGroup);

module.exports = router;





/*const express = require('express');
const router = express.Router();
const ItemStore = require('../services/item-store');

router.get('/items', (req, res) => {
    ItemStore.getAllItems((err, items) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(items);
    });
});

module.exports = router;*/



