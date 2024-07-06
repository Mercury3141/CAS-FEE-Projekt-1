






import { httpService } from './http-service.js'
import {itemStore} from "../../../services/item-store";

class ItemService {
    async createPizza(pizzeName) {
        return httpService.ajax("POST", "/orders/", { name: pizzeName });
    }

    async getOrders() {
        return httpService.ajax("GET", "/orders/", undefined);
    }

    async getOrder(id) {
        return httpService.ajax("GET", `/orders/${id}`, undefined);
    }

    async deleteOrder(id) {
        return httpService.ajax("DELETE", `/orders/${id}`, undefined);
    }
}

export const orderService = new OrderService();


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


    getGroups = async (req, res) => {
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
