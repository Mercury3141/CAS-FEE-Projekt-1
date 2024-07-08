const express = require('express');
const router = express.Router();
const itemStore = require('../services/item-store');

router.post('/groups', async (req, res) => {
    try {
        const group = await itemStore.createGroup(req.body);
        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create group' });
    }
});

module.exports = router;





/*
import express from 'express';

const router = express.Router();
import { itemController } from '../controller/item-controller.js';


router.get('/items', itemController.getItems);
router.post('/items', itemController.addItem);


export const indexRoutes = router;
*/
