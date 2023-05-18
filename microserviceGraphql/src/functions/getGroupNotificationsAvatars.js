const User = require('../models/user');

const getGroupNotificationsAvatars = async function(groupNotification) {
    let len=groupNotification.groupNotifications.length;
   for (let i = 0; i < len; i++) {
        let lenMembers= groupNotification.groupNotifications[i].members.length;
        for (let ii=0; ii < lenMembers; ii++){
            let id=groupNotification.groupNotifications[i].members[ii].id;
            let user = await User.findOne({ _id: id });
            groupNotification.groupNotifications[i].members[ii].email=user.email;
            groupNotification.groupNotifications[i].members[ii].firstName=user.firstName;
            groupNotification.groupNotifications[i].members[ii].lastName=user.lastName;
            groupNotification.groupNotifications[i].members[ii].avatar=user.avatar;
        }       
    }
   return groupNotification;
};

module.exports = getGroupNotificationsAvatars; 