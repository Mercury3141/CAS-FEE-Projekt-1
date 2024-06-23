const apiUrl = '/api/list-groups';

const fetchWithHandling = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error with request to ${url}:`, error);
        throw error;
    }
};

export const getListGroups = async () => {
    return fetchWithHandling(apiUrl);
};

export const saveListGroups = async (listGroups) => {
    await fetchWithHandling(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(listGroups)
    });
};

export const updateListGroup = async (listGroupId, updatedListGroup) => {
    await fetchWithHandling(`${apiUrl}/${listGroupId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedListGroup)
    });
};
