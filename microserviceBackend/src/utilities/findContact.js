const Contact = require('../models/contact');

const findContact = async function (identification) {
    const contact = await Contact.findOne({ identification });
    return contact
};

module.exports = findContact; 