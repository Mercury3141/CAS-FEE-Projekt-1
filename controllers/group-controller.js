const groupStore = require('../services/group-store'); // Correct the path to services
const bodyParser = require('body-parser');

exports.getAllGroups = (req, res) => {
    groupStore.loadData()
        .then(data => res.json(data.groups))
        .catch(err => res.status(500).json({ success: false, error: err.message }));
};

exports.getGroupById = (req, res) => {
    const groupId = Number(req.params.id);
    groupStore.loadData()
        .then(data => {
            const group = data.groups.find(g => g.id === groupId);
            if (group) {
                res.json(group);
            } else {
                res.status(404).json({ success: false, error: 'Group not found' });
            }
        })
        .catch(err => res.status(500).json({ success: false, error: err.message }));
};

exports.createGroup = (req, res) => {
    const newGroup = req.body;
    groupStore.loadData()
        .then(data => {
            data.groups.push(newGroup);
            return groupStore.saveData(data);
        })
        .then(() => res.json({ success: true, data: newGroup }))
        .catch(err => res.status(500).json({ success: false, error: err.message }));
};

exports.updateGroup = (req, res) => {
    const groupId = Number(req.params.id);
    groupStore.loadData()
        .then(data => {
            const group = data.groups.find(g => g.id === groupId);
            if (group) {
                Object.assign(group, req.body);
                return groupStore.saveData(data);
            } else {
                return res.status(404).json({ success: false, error: 'Group not found' });
            }
        })
        .then(() => res.json({ success: true }))
        .catch(err => res.status(500).json({ success: false, error: err.message }));
};

exports.deleteGroup = (req, res) => {
    const groupId = Number(req.params.id);
    groupStore.loadData()
        .then(data => {
            const index = data.groups.findIndex(g => g.id === groupId);
            if (index !== -1) {
                data.groups.splice(index, 1);
                return groupStore.saveData(data);
            } else {
                return res.status(404).json({ success: false, error: 'Group not found' });
            }
        })
        .then(() => res.json({ success: true }))
        .catch(err => res.status(500).json({ success: false, error: err.message }));
};
