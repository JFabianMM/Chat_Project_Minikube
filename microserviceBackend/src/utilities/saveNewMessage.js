const Messages = require('../models/messages');
const findMessages = require('./findMessages');

const saveNewMessage= async function(input, users) {
    let usersLen=users.length;
   for (let i = 0; i < usersLen; i++) {
        let messages = await findMessages(users[i].id);
        
        let index=-1; 
        index = messages.messagesInformation.findIndex(function (el){
                return el.room == input.room;
        });
        let pos='left';
        if (input.origin==users[i].id){
            pos='right';
        }
        if (index>=0){
            if (pos == 'left'){
                messages.messagesInformation[index].alreadyread='false';
            }else{
                messages.messagesInformation[index].alreadyread='true';
            }
            let len= messages.messagesInformation[index].messages.length;
            let newMessage={
                id: len, 
                origin: input.origin,
                firstName: input.firstName, 
                lastName: input.lastName,
                message: input.message, 
                position: pos,
                time: input.time
            }
            messages.messagesInformation[index].messages=messages.messagesInformation[index].messages.concat(newMessage);
        }
        messages.save();
    }
};

module.exports = saveNewMessage;