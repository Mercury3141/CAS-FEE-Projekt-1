const apiUrl = '/api/list-groups';

export const getListGroups = async () => {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching list groups:', error);
        throw error; // Re-throw the error to be handled by the caller
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
        throw error; // Re-throw the error to be handled by the caller
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
        throw error; // Re-throw the error to be handled by the caller
    }
};
