const express = require('express');
const router = express.Router();
const ItemStore = require('../services/item-store');

// Item routes
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

module.exports = router;





/*
import {itemStore} from '../services/item-store.js'
import {groupStore} from '../services/group-store.js'

export class ItemController {
    getItems = async (req, res) => {
        res.json(await itemStore.all() || []);
    };

    createItem = async (req, res) => {
        res.json(await itemStore.add(req.body.name));
    };

    deleteItem = async (req, res) => {
        res.json(await itemStore.delete(req.params.id));
    };

    updateItem = async (req, res) => {
        res.json(await itemStore.update(req.params.id, req.body.name));
    };


    getGrou/!**!/ps = async (req, res) => {
        res.json(await groupStore.getItems(req.params.groupId));
    };

    createGroup = async (req, res) => {
        res.json(await groupStore.add(req.body.name));
    };

    deleteGroup = async (req, res) => {
        const result = await groupStore.delete(req.params.groupId);
        res.json(result);
    };

    updateGroup = async (req, res) => {
        res.json(await groupStore.update(req.params.id, req.body.name));
    };
}

export const itemController = new ItemController();
*/
