const express = require('express');
const router = express.Router();
const path = require('path');
const itemsController = require('../controller/item-controller');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/index.html'));
});

router.post('/api/groups', itemsController.createGroup);

module.exports = router;







/*
import express from 'express';

const router = express.Router();
import { itemController } from '../controller/item-controller.js';


router.get('/items', itemController.getItems);
router.post('/items', itemController.addItem);


export const indexRoutes = router;
*/
