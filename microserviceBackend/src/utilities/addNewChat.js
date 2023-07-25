const addNewChat= function(contact,user, alreadyread="true"){
    let users=[{id:user.id},{id:contact.id}];
    let messages=[];
    let contactRoom={
        alreadyread: alreadyread,
        room:contact.room, 
        users:users,
        name:'',
        messages:messages
    }
    return contactRoom;
}

module.exports = addNewChat; 
