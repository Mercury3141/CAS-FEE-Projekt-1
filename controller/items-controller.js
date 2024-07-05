import {itemStore} from '../services/item-store.js'

// import {SecurityUtil} from '../utils/security.js'

export class ItemController {

    getItems = async (req, res) => {
        res.json((await itemStore.all() || []));
    };

    createItem = async (req, res) => {
        res.json(await itemStore.add(req.body.name));
    };

    showItem = async (req, res) => {
        res.json(await itemStore.get(req.params.id));
    };

    deleteItem = async (req, res) => {
        res.json(await itemStore.delete(req.params.id));
    };

    updateItem = async (req, res) => {
        res.json(await itemStore.update(req.params.id, req.body.name));
    };


    createGroup = async (req, res) => {
        res.json(await groupStore.add(req.body.name));
    };

    addItemToGroup = async (req, res) => {
        res.json(await groupStore.addItem(req.params.groupId, req.body.itemId));
    };

    removeItemFromGroup = async (req, res) => {
        res.json(await groupStore.removeItem(req.params.groupId, req.params.itemId));
    };

    getGroupItems = async (req, res) => {
        res.json(await groupStore.getItems(req.params.groupId));
    };

    deleteGroup = async (req, res) => {
        const result = await groupStore.delete(req.params.groupId);


        export const itemController = new ItemController();
    }