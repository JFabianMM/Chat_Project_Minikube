const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {User, Notification, GroupNotification, Contact, Group, Messages, Settings} = require('../models');
const logger = require("../logger");

const {findContact, findNotification, findGroupNotification, findGroup, findSettings, findMessages, saveNewMessage, addNewChat, addNewGroupChat, getUniqueListBy, reviewNotifications, reviewMessages} = require('../utilities');

router.post('/register', async (req, res)=>{ 
    const identification= req.body.identification;
    let { email, firstName, lastName } = req.body.input;
    const user = new User({identification});
    user.firstName=firstName;
    user.lastName=lastName;
    user.save();
    const notification = new Notification({identification});
    const contact = new Contact({identification});
    const group = new Group({identification});
    const groupNotification = new GroupNotification({identification});
    const messages = new Messages({identification});
    const settings = new Settings({identification}); 
    const logger = require("../logger");
 
    try {
        notification.save();
        contact.save(); 
        group.save();
        groupNotification.save();
        messages.save(); 
        settings.save(); 
        res.send({notification, contact, group, groupNotification, messages});
    } catch (e){
        logger.log("error", e);
        res.status(400).send(e)
    }  
});

router.post('/update', async (req, res)=>{ 
    const identification= req.body.identification;
    const firstName= req.body.firstName;
    const lastName= req.body.lastName;
    const user = await User.findOne({ identification });

    if (firstName.length <= 20 && firstName!=''){
        user.firstName=firstName;
    }
    if (lastName.length <= 20 && lastName!=''){
        user.lastName=lastName;
    }
    user.save();
 
    try { 
        res.send({user});
    } catch (e){
        logger.log("error", e);
        res.status(400).send(e)
    }  
});

router.post('/userInformation', async (req, res)=>{ 
    try{
        const identification = req.body.identification;
        const room= req.body.room;
        const messages = await findMessages(identification);
        const messages1= messages.messagesInformation.filter((el) => {
            return el.room == room;
        });
        if (messages1.length>0){
            const user = await User.findOne({ identification });
            res.send(user);
        }else{
            const form={
                found: true,
              }   
            res.send(form);
        }
    }catch(e){
        logger.log("error", e);
        res.status(400).send(e)
    }    
});

router.post('/contactValidation', async (req, res)=>{ 
    try{
        const identification = req.body.identification;
        const id= req.body.id;
    
        const contact = await findContact(identification);
        const contactFound= contact.contacts.filter((el) => {
            return el.room == id;
        });
        const notification= await findNotification(id);
        let number;
        if (contactFound.length==0){
            number = notification.notifications.length;
        }
        const form={
            found: number,
        }   
        res.send(form);
    }catch(e){
        logger.log("error", e);
        res.status(400).send(e)
    }    
});

router.post('/login', async (req, res)=>{ 
    try{
        const identification = req.body.identification;
        const [contact, notification, groupNotification, group, messages, settings] = await Promise.all([findContact(identification),findNotification(identification), findGroupNotification(identification), findGroup(identification), findMessages(identification), findSettings(identification)]);
        let loginResponse = {
            contact,
            notification,
            groupNotification: groupNotification.groupNotifications,
            group,      
            messages: messages.messagesInformation,
            language: settings.language
        }
        res.send({loginResponse});
    }catch(e){
        logger.log("error", e);
        res.status(400).send(e)
    }    
});

router.post('/notification', async (req, res)=>{ 
    try{
        let userId=req.body.userId;                     
        let id=req.body.id;  
        const [notification, contact,contactRequested, messages] = await Promise.all([findNotification(id),findContact(userId), findContact(id), findMessages(userId)]);                            
        let contactFound = contact.contacts.filter((el) => {
            return el.id == id;
        });

        if (contactFound.length==0){
            let room = mongoose.Types.ObjectId();
            room = JSON.stringify(room);
            room = room.replaceAll('"', '');
            
            let newNotification ={id:userId, room:room};  
            let foundNotification = notification.notifications.filter((el) => {
                return el.id == userId;
            });
    
            if (foundNotification.length==0){
                notification.notifications = notification.notifications.concat(newNotification);
                notification.save(); 

                let newContact ={id:id, room:room , status: 'pending'};
                contact.contacts = contact.contacts.concat(newContact);
                contact.save(); 
                let newContactRequested ={id:userId, room:room , status: 'normal'};
                contactRequested.contacts = contactRequested.contacts.concat(newContactRequested);
                let newMessageRoom = addNewChat(newContactRequested,newContact, "true");
                messages.messagesInformation=messages.messagesInformation.concat(newMessageRoom);
                messages.save();
            }
        }
        
        let CreateContactResponse = {
            user: contact,
            contactId: id,
            number: notification.notifications.length
        }
        res.send({CreateContactResponse});
    }catch(e){
        logger.log("error", e);
        res.status(400).send(e) 
    }
});

router.post('/contact', async (req, res)=>{
    let contactid=req.body.contactid;         
    let userid=req.body.userid;    
    const room=req.body.room;              
    try{
        const [contact, contact2, notification] = await Promise.all([findContact(contactid),findContact(userid), findNotification(userid)]);   
        let newContact ={id:userid, room:room , status: 'normal'};
        let newContact2 ={id:contactid, room:room , status: 'normal'};
        let foundContact = contact.contacts.findIndex(element => element.room == room);
        contact.contacts[foundContact].status='normal';
        let identification=contactid;
        const found = notification.notifications.find(element => element.id == identification);  
        notification.notifications = notification.notifications.filter((el) => {
                return el.id !== identification;
        })
        notification.save();
        let newMessageRoom = addNewChat(newContact2,newContact, "false");
        let messages = await findMessages(newContact.id);
        messages.messagesInformation=messages.messagesInformation.concat(newMessageRoom);
        if (found){
            contact.save(); 
            contact2.contacts = contact2.contacts.concat(newContact2);
            contact2.save(); 
            messages.save();
        }
        let CreateContactResponse = {
            user: contact2,
            contactId: contactid,
            number: notification.notifications.length
        }
        res.send({CreateContactResponse});
    }catch(e){
        logger.log("error", e);
        res.status(400).send(e)
    }
});

router.post('/group', async (req, res)=>{
    let input = req.body.input;
    try {  
        const [group, groupNotification, messages, contact] = await Promise.all([findGroup(input.id),findGroupNotification(input.id), findMessages(input.id), findContact(input.group.members[0].id)]);
        const creator= input.group.members[0].id;
        const room= input.group.room;
        const contactFound = contact.contacts.find(element => element.id == input.id);  
        let members=[];
        input.group.members.forEach(element => {
                let member={
                    id:element.id
                }
                members=members.concat(member);
        });
        let membersUnique = getUniqueListBy(members, 'id');
        const notificationFound = groupNotification.groupNotifications.find(element => element.room == input.group.room); 
        let newgroup={
            room:room,
            creator:creator,
            members:membersUnique,
            name:input.name
        }
        groupNotification.groupNotifications = groupNotification.groupNotifications.filter((el) => {
            return el.room !== room;
        });
        groupNotification.save();
        if (notificationFound && contactFound){
            group.groups = group.groups.concat(newgroup);
            let len= group.groups.length;
            const createdGroup=group.groups[len-1];
            const newMessageRoom = addNewGroupChat(createdGroup);
            messages.messagesInformation=messages.messagesInformation.concat(newMessageRoom);
        }
        group.save();         
        messages.save();
        let response = {
            len: groupNotification.groupNotifications.length,      
            group: group
        } 
        res.send({response});
    } catch (e){
        logger.log("error", e);
        res.status(400).send(e)
    }
});
     
router.patch('/group', async (req, res)=>{    
    let input = req.body.input;
    try {  
        const group = await findGroup(input.id);
        const creator=input.id;
        let members=[];
        input.group.members.forEach(element => {
                let member={
                    id:element.id
                }
                members=members.concat(member);
        });
        
        const contact=await findContact(input.id);
        let newMembers=[];
        newMembers=newMembers.concat(members[0]);
        for(let i=0; i<members.length; i++){
            let contactFound= contact.contacts.filter((el) => {
                return el.id == members[i].id;
            });
            if(contactFound.length>0 && contactFound[0].status!='pending'){
                newMembers=newMembers.concat(members[i]);
            }
        }
        members=newMembers;
        newMembers = getUniqueListBy(members, 'id');
        const name=input.name;
        const room=input.group.room; 
        let formerMembers=group.groups.filter((el) => {
            return el.room == room;
        });
        let formerLen= formerMembers[0].members.length;
        let newLen=newMembers.length;
        let eliminated=[];
        let added=[];
        let stay=[];
        for (let i=0;i<formerLen; i++){    
            let found = newMembers.find(element => element.id == formerMembers[0].members[i].id);
            if (!found){
                eliminated=eliminated.concat(formerMembers[0].members[i]);
            }else{
                stay=stay.concat(formerMembers[0].members[i]);
            }
        }
        for (let i=0;i<newLen; i++){  
            const found = formerMembers[0].members.find(element => element.id == newMembers[i].id);
            if (!found){
                added=added.concat(newMembers[i]);
            }
        }
        let eliminatedLen=eliminated.length;

        if (formerMembers[0].creator==input.id){
            await reviewNotifications(eliminated,room);
            await reviewMessages(eliminated, room);
            for (let i=0; i<eliminatedLen; i++){
                let group = await findGroup(eliminated[i].id);
                group.groups=group.groups.filter((el) => {
                    return el.room != room;
                });
                group.save();
            }
            let stayLen=stay.length;
            for (let i=0; i<stayLen; i++){
                let group = await findGroup(stay[i].id);
                const index = group.groups.findIndex(object => {
                    return object.room == room;
                });
                if (index>=0){
                    group.groups[index].members=newMembers;
                    group.groups[index].name=name;
                    if (input.id==stay[i].id){
                        await group.save();
                    }else{
                        group.save();
                    }
                }
            }  
        }  
        function saveNotifications(members, room, creator, name) {
            let result = new Array();
            members.forEach(function(member) {
                let identification=member.id;
                GroupNotification.findOne({ identification }).lean().exec(function (err, groupNotification) {
                    let newGroupNotification={room, creator, members:newMembers, name};
                    let gr=groupNotification.groupNotifications.concat(newGroupNotification);

                    if (identification!=input.id){
                        result.push(groupNotification);
                        GroupNotification.updateOne({ identification }, { groupNotifications: gr }, function(
                            err,
                            result
                        ) {
                            if (err) {
                                res.send(err);
                            } 
                        });
                    }
                });
            });
        }
        if (formerMembers[0].creator==input.id){
            saveNotifications(added,room, creator, name);
        }

        const newGroup = await findGroup(input.id); 
        if (input.group.members.length==1){
            newGroup.groups=newGroup.groups.filter((el) => {
                return el.room != room;
            });
            newGroup.save();
        }
        res.send(newGroup);
    } catch (e){
        logger.log("error", e);
        res.status(400).send(e)
    }
});

router.patch('/leavegroup', async (req, res)=>{    
    let input = req.body.input;
    try {  
        const group = await findGroup(input.id);
        const room=input.group.room; 
        group.groups=group.groups.filter((el) => {
            return el.room != room;
        });
        group.save();

        let members=[];
        input.group.members.forEach(element => {
                let member={
                    id:element.id
                }
                if(element.id != input.id){
                    members=members.concat(member);
                }
                
        });
        const newMembers = getUniqueListBy(members, 'id');
        let stayLen=newMembers.length;
        for (let i=0; i<stayLen; i++){
            let group = await findGroup(newMembers[i].id);
            const index = group.groups.findIndex(object => {
                return object.room == room;
            });
            if (index>=0){
                group.groups[index].members=newMembers;
                group.save();
            }
        }   
        res.send(group);
    } catch (e){
        logger.log("error", e);
        res.status(400).send(e)
    }
});

router.patch('/groupnotification', async (req, res)=>{    
    let input = req.body.input;
    try {  
        const room=input.group.room;
        const creator = input.group.members[0].id;
        const group = await findGroup(creator);
        let formerMembers=group.groups.filter((el) => {
            return el.room == room;
        });
        let members=[];
        formerMembers[0].members.forEach(element => {
                let member={
                    id:element.id
                }
                if (element.id != input.id){
                    members=members.concat(member);
                }               
        });
        const newMembers = getUniqueListBy(members, 'id');
        let stayLen=newMembers.length;
        for (let i=0; i<stayLen; i++){
            let group = await findGroup(newMembers[i].id);
            const index = group.groups.findIndex(object => {
                return object.room == room;
            });
            if (index>=0){
                group.groups[index].members=newMembers;
                group.save();
            }
        } 
        const newGroup = await findGroup(input.id); 
        res.send(newGroup);
    } catch (e){
        logger.log("error", e);
        res.status(400).send(e)
    }
});

router.post('/groupandnotifications', async (req, res)=>{
    let input = req.body.input;
    try {  
        let creator= input.id;
        const [group, contact, messages] = await Promise.all([findGroup(creator),findContact(creator), findMessages(input.id)]);
        let members = getUniqueListBy(input.group.members, 'id');

        let newMembers=[];
        newMembers=newMembers.concat(members[0]);
        for(let i=0; i<members.length; i++){
            let contactFound= contact.contacts.filter((el) => {
                return el.id == members[i].id;
            });
            if(contactFound.length>0 && contactFound[0].status!='pending'){
                newMembers=newMembers.concat(members[i]);
            }
        }
        members=newMembers;

        let tentativeMembers=members;

        tentativeMembers.forEach(function(member) { 
            let memberFound = contact.contacts.filter(function (el){
                return el.id == member.id;
            });
            let len = memberFound.length;
            if (len==0 && member.id!=creator){
                let newMembers = members.filter((value) => member.id !== value.id);
                members=newMembers;
            }
        })

        let name=input.name;                     
        let newGroup={room:'', creator,  members, name};
        group.groups = group.groups.concat(newGroup);
        let len= group.groups.length;
        room = JSON.stringify(group.groups[len-1]._id);
        room = room.replaceAll('"', '');
        group.groups[len-1].room=room; 
        group.save(); 

        function saveNotifications(members, room, creator, name) {
            let result = new Array();
            members.forEach(function(member) {
                let identification=member.id;
                GroupNotification.findOne({ identification }).lean().exec(function (err, groupNotification) {
                    let newGroupNotification={room, creator, members, name};
                    let gr=groupNotification.groupNotifications.concat(newGroupNotification);
                    if (identification!=input.id){
                        result.push(groupNotification);
                        GroupNotification.updateOne({ identification }, { groupNotifications: gr }, function(
                            err,
                            result
                        ) {
                            if (err) {
                                res.send(err);
                            } 
                        });
                    }
                });
            });
        }
        saveNotifications(members,room, creator, name);
        const createdGroup=group.groups[len-1];
        const newMessageRoom = addNewGroupChat(createdGroup);
        messages.messagesInformation=messages.messagesInformation.concat(newMessageRoom);
        messages.save();
        res.send(group);
    } catch (e){
        logger.log("error", e);
        res.status(400).send(e)
    }
});

router.post('/message', async (req, res)=>{
    let input = req.body.input;
    try {  

            const utcTime = new Date().toISOString(); 
            let messages = await findMessages(input.id);
            let index=-1; 
            index = messages.messagesInformation.findIndex(function (el){
                return el.room == input.room;
            });
            const NewMessageResponse = {
                id:input.id,
                room: input.room,
                origin: input.id,
                firstName: input.firstName, 
                lastName:  input.lastName,
                message: input.message,
                time: utcTime 
            };

            if (index>=0){
                let users=messages.messagesInformation[index].users;
                const saveMessage = saveNewMessage(NewMessageResponse, users);
            }
            res.send(NewMessageResponse);
    } catch (e){
        logger.log("error", e);
        res.status(400).send(e)
    }
});

router.post('/status', async (req, res)=>{
    let input = req.body.input;
    try {  
        let messages = await findMessages(input.id);
        let index=-1; 
        index = messages.messagesInformation.findIndex(function (el){
                return el.room == input.room;
        });
    
        if (index>=0){
            if (input.status === 'true'){
                messages.messagesInformation[index].alreadyread='true';
            }else{
                messages.messagesInformation[index].alreadyread='false';
            }   
        }
        messages.save();
        let result=  {result: input.room}
        res.send(result);
    } catch (e){
        logger.log("error", e);
        res.status(400).send(e)
    }
});

router.post('/language', async (req, res)=>{
    let language=req.body.language;              
    let identification=req.body.identification; 
    try {  
        let settings = await findSettings(identification);
        settings.language=language;
        settings.save();
        res.send({language});
    } catch (e){
        logger.log("error", e);
        res.status(400).send(e)
    }
});

router.get('/notification', async (req, res)=>{ 
    try{
        const notification = await findNotification(req.query.identification);
        if (notification){res.send(notification)}else{res.send()}  
    }catch(e){
        logger.log("error", e);
        res.status(400).send(e)
    }    
});

router.get('/groupnotifications', async (req, res)=>{ 
    try{
        const groupNotification = await findGroupNotification(req.query.identification);
        res.send(groupNotification)
    }catch(e){
        logger.log("error", e);
        res.status(400).send(e)
    }    
});

router.get('/groups', async (req, res)=>{  
    try{
        const group = await findGroup(req.query.identification);
        res.send(group)
    }catch(e){
        logger.log("error", e);
        res.status(400).send(e)
    }    
});

router.get('/contact', async (req, res)=>{    
    try {
        const contact = await findContact(req.query.identification);
        res.send(contact);
    } catch (e){
        logger.log("error", e);
        res.status(400).send(e)
    }
});

router.delete('/notification', async (req, res)=>{
    const userId=req.query.userId;
    const contactId=req.query.contactid;
    const room=req.query.room;
    try{
        const [notification, contact,messages] = await Promise.all([findNotification(userId),findContact(contactId), findMessages(contactId)]);
        let identification=contactId;
        notification.notifications = notification.notifications.filter((el) => {
            return el.id !== identification;
        });
        notification.save();
        contact.contacts = contact.contacts.filter((el) => {
            return el.id !== userId;
        });
        contact.save();
        messages.messagesInformation = messages.messagesInformation.filter((el) => {
            return el.room !== room;
        });
        messages.save();
        let DeleteNotificationResponse ={
            number: notification.notifications.length
        }
        res.send({DeleteNotificationResponse});
    }catch(e){
        logger.log("error", e);
        res.status(400).send(e)
    }
});

router.delete('/contact', async (req, res)=>{
    const userId=req.query.userId;         
    const contactId=req.query.contactid;     
    const room=req.query.room;              

    try{
        const [notification, contactOrigin, contactDestination, messagesOrigin, messagesDestination] = await Promise.all([findNotification(contactId),findContact(userId), findContact(contactId), findMessages(userId), findMessages(contactId)]); 
     
        notification.notifications = notification.notifications.filter((el) => {
            return el.id !== userId;
        });
        notification.save();

        contactOrigin.contacts = contactOrigin.contacts.filter((el) => {
            return el.id !== contactId;
        });
        contactOrigin.save();
        contactDestination.contacts = contactDestination.contacts.filter((el) => {
            return el.id !== userId;
        });
        contactDestination.save();

        messagesOrigin.messagesInformation = messagesOrigin.messagesInformation.filter((el) => {
            return el.room !== room;
        });
        messagesOrigin.save();
        messagesDestination.messagesInformation = messagesDestination.messagesInformation.filter((el) => {
            return el.room !== room;
        });
        messagesDestination.save();
        let DeleteContactResponse ={
            number: notification.notifications.length
        }
        res.send({DeleteContactResponse});
    }catch(e){
        logger.log("error", e);
        res.status(400).send(e)
    }
});

router.delete('/groupnotification', async (req, res)=>{ 
    const id=req.query.userId;
    const room=req.query.room;
    try {  
        let groupNotification = await findGroupNotification(id);
        groupNotification.groupNotifications = groupNotification.groupNotifications.filter((el) => {
            return el.room !== room;
        });
        groupNotification.save();
        let deleteNotificationResponse ={
            number: groupNotification.groupNotifications.length
        } 
        res.send({deleteNotificationResponse});
    } catch (e){
        logger.log("error", e);
        res.status(400).send(e)
    }
});

module.exports=router;






