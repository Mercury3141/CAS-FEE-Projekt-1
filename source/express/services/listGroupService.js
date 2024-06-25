const listGroupModel = require('../models/listGroupModel');

exports.getListGroups = async () => {
    return await listGroupModel.getAll();
};

exports.createListGroup = async (data) => {
    return await listGroupModel.create(data);
};

exports.updateListGroup = async (id, data) => {
    return await listGroupModel.update(id, data);
};

exports.deleteListGroup = async (id) => {
    return await listGroupModel.delete(id);
};
