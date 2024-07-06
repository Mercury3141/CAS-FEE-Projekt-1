const itemStore = require('../services/item-store');

async function createGroup(req, res) {
    const newGroup = await itemStore.createGroup(req.body.groupName);
    res.status(201).json(newGroup);
}

module.exports = {
    createGroup
};





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
