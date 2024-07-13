import HttpService from './http-service.js';

class GroupService {
    static async createGroup() {
        return HttpService.post('/groups');
    }
}

export default GroupService;
