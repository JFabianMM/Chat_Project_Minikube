const User = require('../models/user');

const getContactAvatars = async function(contact) {
    let len=contact.contacts.length;
   for (let i = 0; i < len; i++) {
        let id=contact.contacts[i].id;
        let user = await User.findOne({ _id: id });
        contact.contacts[i].email=user.email;
        contact.contacts[i].firstName=user.firstName;
        contact.contacts[i].lastName=user.lastName;
        contact.contacts[i].avatar=user.avatar;
    }
   return contact
};

module.exports = getContactAvatars; 