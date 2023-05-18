const User = require('../models/user');

const getNotificationsAvatars = async function(notification) {
    let len=notification.notifications.length;
   for (let i = 0; i < len; i++) {
        let id=notification.notifications[i].id;
        let user = await User.findOne({ _id: id });
        notification.notifications[i].email=user.email;
        notification.notifications[i].firstName=user.firstName;
        notification.notifications[i].lastName=user.lastName;
        notification.notifications[i].avatar=user.avatar;
    }
   return notification
};

module.exports = getNotificationsAvatars; 