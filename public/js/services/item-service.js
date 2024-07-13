export default class ItemService {
    static async getAllItems() {
        const response = await fetch('/api/items');
        if (!response.ok) {
            throw new Error('Failed to fetch items');
        }
        return response.json();
    }

    static async getItemById(id) {
        const response = await fetch(`/api/items/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch item');
        }
        return response.json();
    }

    static async createItem(item) {
        const response = await fetch('/api/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
        });
        if (!response.ok) {
            throw new Error('Failed to create item');
        }
        return response.json();
    }

    static async updateItem(id, item) {
        const response = await fetch(`/api/items/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
        });
        if (!response.ok) {
            throw new Error('Failed to update item');
        }
        return response.json();
    }

    static async deleteItem(id) {
        const response = await fetch(`/api/items/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete item');
        }
        return response.json();
    }
}
