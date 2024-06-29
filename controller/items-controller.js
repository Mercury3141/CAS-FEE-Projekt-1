import {orderStore} from '../services/item-store.js'
import {SecurityUtil} from '../utils/security.js'

export class ItemController {

    getItems = async (req, res) => {
        res.json((await itemStore.all(SecurityUtil.currentUser(req)) || []))
    };

    createItem = async (req, res) => {
        res.json(await itemStore.add(req.body.name, SecurityUtil.currentUser(req)));
    };

    showItem = async (req, res) => {
        res.json(await itemStore.get(req.params.id, SecurityUtil.currentUser(req)));
    };

    deleteItem = async (req, res) => {
        res.json(await itemStore.delete(req.params.id, SecurityUtil.currentUser(req))); // TODO should return 402 if not ok
    };
}

export const itemController = new ItemController();
