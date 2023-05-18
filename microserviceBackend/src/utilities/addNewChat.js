const addNewChat= function(contact,user){
    let users=[{id:user.id, firstName: user.firstName, lastName: user.lastName},{id:contact.id, firstName:contact.firstName, lastName: contact.lastName}];
    let messages=[];
    let contactRoom={
        alreadyread:false,
        room:contact.room, 
        users:users,
        name:'',
        messages:messages
    }
    return contactRoom;
}

module.exports = addNewChat; 