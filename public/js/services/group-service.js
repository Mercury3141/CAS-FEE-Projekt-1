import httpService from './http-service.js';

class GroupService {
    async getGroups() {
        return await httpService.get('/api/groups');
    }

    async createGroup(data) {
        return await httpService.post('/api/groups', data);
    }

    async updateGroup(id, data) {
        return await httpService.put(`/api/groups/${id}`, data);
    }

    async deleteGroup(id) {
        return await httpService.delete(`/api/groups/${id}`);
    }
}

export default new GroupService();
