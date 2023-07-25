const GroupNotification = require('../models/groupNotification');

const reviewNotifications = async function(members, room) {
    let len=members.length;
   for (let i = 0; i < len; i++) {
        let identification=members[i].id;
        let groupNotification= await GroupNotification.findOne({ identification });
        groupNotification.groupNotifications= groupNotification.groupNotifications.filter((el) => {
                return el.room != room;
        });
        await groupNotification.save();
    }
};

module.exports = reviewNotifications;