export default class GroupService {
    static async getAllGroups() {
        const response = await fetch('/api/groups');
        if (!response.ok) {
            throw new Error('Failed to fetch groups');
        }
        return response.json();
    }

    static async getGroupById(id) {
        const response = await fetch(`/api/groups/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch group');
        }
        return response.json();
    }

    static async createGroup(group) {
        const response = await fetch('/api/groups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(group),
        });
        if (!response.ok) {
            throw new Error('Failed to create group');
        }
        return response.json();
    }

    static async updateGroup(id, group) {
        const response = await fetch(`/api/groups/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(group),
        });
        if (!response.ok) {
            throw new Error('Failed to update group');
        }
        return response.json();
    }

    static async deleteGroup(id) {
        const response = await fetch(`/api/groups/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete group');
        }
        return response.json();
    }
}
