const express = require('express');
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

module.exports = router;





/*
import express from 'express';

const router = express.Router();
import {itemController} from '../controller/item-controller.js';

router.get("/items", itemController.getItems);
router.post("/items", itemController.createItem);
router.delete("/items/:id", itemController.deleteItem);
router.put("/items/:id", itemController.updateItem);

router.get("/groups/:groupId", itemController.getGroups);
router.post("/groups", itemController.createGroup);
router.delete("/groups/:groupId", itemController.deleteGroup);
router.put("/groups/:id", itemController.updateGroup);

export const itemRoutes = router;
*/
