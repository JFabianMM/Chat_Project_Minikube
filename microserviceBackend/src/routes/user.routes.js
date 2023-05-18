const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');
const GroupNotification = require('../models/groupNotification');
const Contact = require('../models/contact');
const Group = require('../models/group');
const Messages = require('../models/messages');

const findContact = require('../utilities/findContact');
const findNotification = require('../utilities/findNotification') 
const findGroupNotification = require('../utilities/findGroupNotification');
const findGroup = require('../utilities/findGroup');
const findMessages = require('../utilities/findMessages');
const saveNewMessage = require('../utilities/saveNewMessage');
const addNewChat = require('../utilities/addNewChat');
const addNewGroupChat = require('../utilities/addNewGroupChat');

router.post('/register', async (req, res)=>{ 
    const identification= req.body.identification;
    let { email } = req.body.input;
    const notification = new Notification({identification,email});
    const contact = new Contact({identification,email});
    const group = new Group({identification,email});
    const groupNotification = new GroupNotification({identification,email});
    const messages = new Messages({identification,email});
    
    try {
        notification.save();
        contact.save(); 
        group.save();
        groupNotification.save();
        messages.save(); 
        res.send({notification, contact, group, groupNotification, messages});
    } catch (e){
        res.status(400).send(e)
    }  
});

router.post('/login', async (req, res)=>{ 
    try{
        const identification = req.body.identification;
        const contact = await findContact(identification);
        const notification = await findNotification(identification);
        const groupNotification = await findGroupNotification(identification);
        const group = await findGroup(identification);
        const messages = await findMessages(identification);
        let loginResponse = {
            contact,
            notification,
            groupNotification: groupNotification.groupNotifications,
            group,      
            messages: messages.messagesInformation
        }
        res.send({loginResponse});
    }catch(e){
        res.status(400).send(e)
    }    
});

router.post('/notification', async (req, res)=>{ 
    try{
        const notification = await findNotification(req.body.identification);
        if (notification){res.send(notification)}else{res.send()}  
    }catch(e){
        res.status(400).send(e)
    }    
});

router.post('/groupnotifications', async (req, res)=>{ 
    try{
        const groupNotification = await findGroupNotification(req.body.identification);
        res.send(groupNotification)
    }catch(e){
        res.status(400).send(e)
    }    
});

router.post('/groups', async (req, res)=>{  
    try{
        const group = await findGroup(req.body.identification);
        res.send(group)
    }catch(e){
        res.status(400).send(e)
    }    
});

router.post('/newnotification', async (req, res)=>{ 
    let userId=req.body.userId;
    let id=req.body.id;
    const notification = await findNotification(id);
    const newNotification ={id:userId};
    notification.notifications = notification.notifications.concat(newNotification);
    notification.save(); 
    if (notification){res.send(notification)}else{res.send()} 
});

router.post('/notificationdeletion', async (req, res)=>{
    let userId=req.body.userId;
    let contactid=req.body.contactid;
    try{
        const notification = await findNotification(userId);
        let identification=contactid;
        notification.notifications = notification.notifications.filter((el) => {
            return el.id !== identification;
        });
        notification.save();
        let DeleteNotificationResponse ={
            number: notification.notifications.length
        }
        res.send({DeleteNotificationResponse});
    }catch(e){
        res.status(400).send(e)
    }
});

router.post('/contact', async (req, res)=>{
    try {
        const contact = await findContact(req.body.identification);
        res.send(contact);
    } catch (e){
        res.status(400).send(e)
    }
});

router.post('/newcontact', async (req, res)=>{
    let input = req.body.input;
    try{
        const contact = await findContact(input.contactid);
        const contact2 = await findContact(input.userid);
        const room=input.userid+input.contactid;
        const newContact ={id:input.userid, room};
        const newContact2 ={id:input.contactid, room };
        contact.contacts = contact.contacts.concat(newContact);
        contact2.contacts = contact2.contacts.concat(newContact2);
        contact.save(); 
        contact2.save(); 
        const notification = await findNotification(input.userid);
        const identification=input.contactid;
        notification.notifications = notification.notifications.filter((el) => {
                return el.id !== identification;
        });
        notification.save();
        let newMessageRoom = addNewChat(newContact2,newContact, room);
        let messages = await findMessages(newContact.id);
        messages.messagesInformation=messages.messagesInformation.concat(newMessageRoom);
        messages.save();
        let newMessageRoom2 = addNewChat(newContact,newContact2, room);
        let messages2 = await findMessages(newContact2.id);
        messages2.messagesInformation=messages2.messagesInformation.concat(newMessageRoom2);
        messages2.save();
        let CreateContactResponse = {
            user: contact2,
            contactId: contact.identification,
            number: notification.notifications.length
        }
        res.send({CreateContactResponse});
    }catch(e){
        res.status(400).send(e)
    }
});
router.post('/newgroup', async (req, res)=>{
    let input = req.body.input;
    try {  
        const group = await findGroup(input.id);
        let members=[];
        input.group.members.forEach(element => {
            let member={
                id:element.id,
                email:element.email,
                firstName:element.firstName,
                lastName:element.lastName
            }
            members=members.concat(member);
        });
        let newgroup={
            room:input.group.room,
            members:members,
            name:input.name
        }
        group.groups = group.groups.concat(newgroup);
        group.save(); 
        let groupNotification = await findGroupNotification(input.id);
        groupNotification.groupNotifications = groupNotification.groupNotifications.filter((el) => {
            return el.room !== input.group.room;
        });
        groupNotification.save();
        let len= group.groups.length;
        const createdGroup=group.groups[len-1];
        const newMessageRoom = addNewGroupChat(createdGroup);
        let messages = await findMessages(input.id);
        messages.messagesInformation=messages.messagesInformation.concat(newMessageRoom);
        messages.save();
        res.send(group);
    } catch (e){
        res.status(400).send(e)
    }
});
     
router.post('/groupnotificationdeletion', async (req, res)=>{ 
    let id=req.body.userId;
    let room=req.body.room;
    try {  
        let groupNotification = await findGroupNotification(id);
        groupNotification.groupNotifications = groupNotification.groupNotifications.filter((el) => {
            return el.room !== room;
        });
        groupNotification.save();
        let DeleteNotificationResponse ={
            number: groupNotification.groupNotifications.length
        } 
        res.send({DeleteNotificationResponse});
    } catch (e){
        res.status(400).send(e)
    }
});

router.post('/groupandnotifications', async (req, res)=>{
    let input = req.body.input;
    try {  
        const group = await findGroup(input.id);    
        let members=input.group.members;
        let name=input.name;                       
        let newGroup={room:'', members:members, name:name};  
        group.groups = group.groups.concat(newGroup);
        let len= group.groups.length;
        room = JSON.stringify(group.groups[len-1]._id);
        room = room.replaceAll('"', '');
        group.groups[len-1].room=room; 
        group.save(); 
        function saveNotifications(members, room, name) {
            let result = new Array();
            members.forEach(function(member) {
                let identification=member.id;
                GroupNotification.findOne({ identification }).lean().exec(function (err, groupNotification) {
                    let newGroupNotification={room:room, members:members, name:name};
                    let gr=groupNotification.groupNotifications.concat(newGroupNotification);
        
                    if (identification!=input.id){
                        result.push(groupNotification);
                        GroupNotification.updateOne({ identification: identification }, { groupNotifications: gr }, function(
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
        saveNotifications(members,room, name)
        const createdGroup=group.groups[len-1];
        const newMessageRoom = addNewGroupChat(createdGroup);
        let messages = await findMessages(input.id);
        messages.messagesInformation=messages.messagesInformation.concat(newMessageRoom);
        messages.save();
        res.send(group);
    } catch (e){
        res.status(400).send(e)
    }
});

router.post('/newmessage', async (req, res)=>{
    let input = req.body.input;
    try {  
        let messages = await findMessages(input.id);
        let index=-1; 
        index = messages.messagesInformation.findIndex(function (el){
            return el.room == input.room;
        });
        if (index>=0){
            let users=messages.messagesInformation[index].users;
            saveNewMessage(input, users);
        }
        let result=  {result: input.room}
        return result;
    } catch (e){
        res.status(400).send(e)
    }
});

router.post('/newstatus', async (req, res)=>{
    let input = req.body.input;
    try {  
        let messages = await findMessages(input.id);
        let index=-1; 
        index = messages.messagesInformation.findIndex(function (el){
                return el.room == input.room;
        });
    
        if (index>=0){
            if (input.status === 'true'){
                messages.messagesInformation[index].alreadyread=true;
            }else{
                messages.messagesInformation[index].alreadyread=false;
            }                
        }
        messages.save();
        let result=  {result: input.room}
        return result;
    } catch (e){
        res.status(400).send(e)
    }
});

module.exports=router;

