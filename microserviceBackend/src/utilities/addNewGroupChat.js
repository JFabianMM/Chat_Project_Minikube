const addNewGroupChat= function(group){
    let members=[];
      let user={};
      group.members.map((element) =>{ 
        user={
          id:element.id
        }
        members = members.concat(user);
    })

    let room=group.room;
    let users=members;
    let messages=[];
    let name=group.name;        
    let contactRoom={
        alreadyread:false,
        room:room, 
        users:users,
        name:name,
        messages:messages
    }
    return contactRoom;
  }

module.exports = addNewGroupChat;