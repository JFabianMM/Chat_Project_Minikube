const Group = require('../models/group');

const findGroup= async function(identification) {
    const group = await Group.findOne({ identification });
    return group
};

module.exports = findGroup;