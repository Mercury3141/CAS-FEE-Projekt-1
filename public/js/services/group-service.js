export async function saveGroup(group) {
    const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(group),
    });
    return response.json();
}

export async function getGroups() {
    const response = await fetch('/api/groups');
    return response.json();
}
