const Messages = require('../models/messages');

const findMessages= async function(identification) {
    const messages = await Messages.findOne({ identification });
    return messages
};

module.exports = findMessages;