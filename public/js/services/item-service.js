// public/js/services/item-service.js

export class ItemService {
    async addGroup(group) {
        const response = await fetch('/api/groups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(group),
        });

        if (!response.ok) {
            throw new Error('Failed to add group');
        }

        return await response.json();
    }
}
