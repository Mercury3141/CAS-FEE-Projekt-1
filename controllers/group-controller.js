const groupStore = require('../services/group-store');

exports.createGroup = (req, res) => {
    const newGroup = req.body;

    // Verify that the newGroup object has all necessary properties
    if (!newGroup.id || !newGroup.textContent) {
        return res.status(400).json({ success: false, error: 'Invalid group data' });
    }

    groupStore.loadData()
        .then(data => {
            // Add default values if necessary
            newGroup.order = newGroup.order || data.groups.length + 1;
            newGroup.checked = newGroup.checked || false;

            data.groups.push(newGroup);
            return groupStore.saveData(data);
        })
        .then(() => res.json({ success: true, data: newGroup }))
        .catch(err => res.status(500).json({ success: false, error: err.message }));
};
