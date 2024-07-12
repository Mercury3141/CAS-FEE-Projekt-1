import httpService from './http-service.js';

class ItemService {
    async getItems(groupId) {
        return await httpService.get(`/api/groups/${groupId}/items`);
    }

    async createItem(groupId, data) {
        return await httpService.post(`/api/groups/${groupId}/items`, data);
    }

    async updateItem(groupId, itemId, data) {
        return await httpService.put(`/api/groups/${groupId}/items/${itemId}`, data);
    }

    async deleteItem(groupId, itemId) {
        return await httpService.delete(`/api/groups/${groupId}/items/${itemId}`);
    }
}

export default new ItemService();
