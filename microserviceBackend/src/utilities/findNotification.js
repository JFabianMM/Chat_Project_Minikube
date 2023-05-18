const Notification = require('../models/notification');

const findNotification= async function(identification) {
    const notification = await Notification.findOne({ identification });
    return notification
};

module.exports = findNotification;