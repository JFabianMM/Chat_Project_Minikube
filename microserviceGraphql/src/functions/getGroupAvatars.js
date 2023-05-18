const User = require('../models/user');

const getGroupAvatars = async function(group) {
    let lenGroups=group.groups.length;
    for (let i = 0; i < lenGroups; i++) {
        let lenMembers = group.groups[i].members.length;
        for (let ii=0; ii<lenMembers; ii++){
            let id=group.groups[i].members[ii].id;
            let user = await User.findOne({ _id: id });
            group.groups[i].members[ii].email=user.email;
            group.groups[i].members[ii].firstName=user.firstName;
            group.groups[i].members[ii].lastName=user.lastName;
            group.groups[i].members[ii].avatar=user.avatar;
        }
    }
   return group
};

module.exports = getGroupAvatars; 