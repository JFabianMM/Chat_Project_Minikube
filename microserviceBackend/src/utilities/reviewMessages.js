const Messages = require('../models/messages');

const reviewMessages = async function(members, room) {
    let len=members.length;
   for (let i = 0; i < len; i++) {
        let identification=members[i].id;
        const messages = await Messages.findOne({ identification });
        messages.messagesInformation= messages.messagesInformation.filter((el) => {
                return el.room != room;
        });
        await messages.save();
    }
};

module.exports = reviewMessages;




