const apiUrl = 'http://localhost:3000/api/list-groups';

export const getListGroups = async () => {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching list groups:', error);
        return [];
    }
};

export const saveListGroups = async (listGroups) => {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(listGroups)
        });
        if (!response.ok) {
            throw new Error('Failed to save data');
        }
    } catch (error) {
        console.error('Error saving list groups:', error);
    }
};

export const updateListGroup = async (listGroupId, updatedListGroup) => {
    try {
        const response = await fetch(`${apiUrl}/${listGroupId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedListGroup)
        });
        if (!response.ok) {
            throw new Error('Failed to update data');
        }
    } catch (error) {
        console.error('Error updating list group:', error);
    }
};

export const deleteListGroup = async (listGroupId) => {
    try {
        const response = await fetch(`${apiUrl}/${listGroupId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete data');
        }
    } catch (error) {
        console.error('Error deleting list group:', error);
    }
};
