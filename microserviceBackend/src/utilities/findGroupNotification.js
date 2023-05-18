const GroupNotification = require('../models/groupNotification');

const findGroupNotification= async function(identification) {
    const groupNotification = await GroupNotification.findOne({ identification });
    return groupNotification
};

module.exports = findGroupNotification;
