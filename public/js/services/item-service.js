// public/js/services/item-service.js

export class ItemService {
    async addGroup(group) {
        const response = await fetch('/api/groups', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(group),
        });

        if (!response.ok) {
            throw new Error('Failed to add group');
        }

        return await response.json();
    }

    async getGroups() {
        const response = await fetch('/api/groups', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch groups');
        }

        return await response.json();
    }

    async deleteGroup(id) {
        const response = await fetch(`/api/groups/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error('Failed to delete group');
        }
    }
}
