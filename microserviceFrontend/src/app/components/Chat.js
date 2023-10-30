import React, { useRef, useEffect } from "react";
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import { UserCard, GroupCard, MessageCard, MenuBar, ChatBar, InputSearch, InputMessage, AddGroupDialog, MainUserCard} from '../components';
import { useDispatch, useSelector} from 'react-redux';
import { updateNotifications, updateMessages, updateCurrentChat, updateContacts, updateGroups, updateCurrentRoom } from '../../redux/slice';
import { socket } from '../functions/socket';
import { queryGroupNotification, queryContact, queryGroups } from "../actions/actions";

window.onbeforeunload = closingCode;
function closingCode(){  
    socket.close();
    return null;
}

let messsa;
export function Chat (props) {
    const userData = useSelector(state => state.userData);
    const contacts = useSelector(state => state.contacts);
    const groups = useSelector(state => state.groups);
    const notifications = useSelector(state => state.notifications);
    const rooms = useSelector(state => state.rooms);
    const currentRoom = useSelector(state => state.currentRoom);
    const messages = useSelector(state => state.messages);
    const currentChat = useSelector(state => state.currentChat);
    const scrollRef = useRef(null);

    const Dispatch = useDispatch();
    let selected= localStorage.getItem('elementId');

    let username = userData.firstName + ' ' + userData.lastName;
    let room = userData._id;
    let flag=0;
    useEffect(() => {
        flag=1;
        socket.emit('join', room)
        rooms.map((item) =>{
            let room=item.room; 
            socket.emit('join', room);
        })
    }, []);

    useEffect(() => {
        let len=rooms.length;
        if (len>0){
            let room=rooms[len-1].room;
            socket.emit('join', room)
        }
    }, [rooms]);

    useEffect(() => {
        messsa=messages;
    }, [messages]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behaviour: "smooth" });
          }
    }, [currentChat]);

    socket.on('sendNotification', ()=>{
        Dispatch(updateNotifications(notifications+1));
    });

    socket.on('sendGroupnotification', ()=>{
        Dispatch(queryGroupNotification());
    });
    
    socket.on('sendMessage', (item)=>{
    if (item.message.trim().length != 0){       
        const messagesUpdated=messsa;
        let tempMessages=[];

        let foundMessage = messagesUpdated.find(element => element.room == item.room);
        if (foundMessage){
        messagesUpdated.forEach(element => {
            let message ={
                alreadyread:element.alreadyread,
                room: element.room,       
                users: element.users,
                messages: element.messages
            }
            tempMessages.push(message);
        });


        let index = tempMessages.findIndex(function (el){
            return el.room == item.room;
        });
        let pos='left';
        if (item.id == userData._id){
            pos='right';
        }

        const utcDate = new Date(item.time);
        let local=utcDate.toLocaleString();
        const localTime = new Date(local);
        let hours = localTime.getHours();
        let minutes = localTime.getMinutes();
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        let current_time = hours+':'+formattedMinutes;

        let newMessage={
            origin: item.id,
            firstName: item.firstName,
            lastName: item.lastName,
            message:item.message,
            time:current_time
        }

        tempMessages[index].messages= tempMessages[index].messages.concat(newMessage);
        if (currentRoom.length>0){
            index=-1
            index = tempMessages.findIndex(function (el){
                return el.room == currentRoom[0].room;
            });

            if (currentRoom[0].room== item.room){
                tempMessages[index].new='true';
                if (pos=='left'){
                    let room= item.room;
                    let index2=-1;
                    let cont=[];
                    contacts.map((contact) =>{ 
                        let newContact={
                            id:contact.id,
                            room:contact.room,
                            status:contact.status,
                            email:contact.email,
                            firstName:contact.firstName,
                            lastName:contact.lastName,
                            alreadyread:contact.alreadyread,
                            avatar:contact.avatar
                        }
                        cont= cont.concat(newContact);
                    })
                    index2 = cont.findIndex(function (el){
                        return el.room == room;
                    });
                    if (index2>=0){
                        cont[index2].alreadyread = 'true';
                        Dispatch(updateContacts(cont));
                    } 
                    index2=-1;
                    let gro=[];
                    groups.map((group) =>{ 
                        let newGroup={
                        room:group.room,
                        members:group.members,
                        name:group.name,
                        alreadyread:group.alreadyread
                        }
                        gro= gro.concat(newGroup);
                    })
                    index2 = gro.findIndex(function (el){
                        return el.room == room;
                    });
                    if (index2>=0){
                        gro[index2].alreadyread = 'true';
                        Dispatch(updateGroups(gro));
                    }
                }
            }else{
                if (pos=='left'){
                    const room= item.room;
                    let index2=-1;
                    let cont=[];
                    contacts.map((contact) =>{ 
                        let newContact={
                            id:contact.id,
                            room:contact.room,
                            email:contact.email,
                            firstName:contact.firstName,
                            lastName:contact.lastName,
                            alreadyread:contact.alreadyread,
                            avatar:contact.avatar
                        }
                        cont= cont.concat(newContact);
                    })
                    index2 = contacts.findIndex(function (el){
                        return el.room == room;
                    });
                    if (index2>=0){
                        cont[index2].alreadyread = 'false';
                        Dispatch(updateContacts(cont));
                    } 
                    
                    let index3=-1;
                    let gro=[];
                    groups.map((group) =>{ 
                        let newGroup={
                        room:group.room,
                        members:group.members,
                        name:group.name,
                        alreadyread:group.alreadyread
                        }
                        gro= gro.concat(newGroup);
                    })
                    index3 = groups.findIndex(function (el){
                        return el.room == room;
                    });
                    if (index3>=0){
                        gro[index3].alreadyread = 'false';
                        Dispatch(updateGroups(gro));
                    }
                    tempMessages[index].new='false';
                }
            }
            if (index>=0){
                Dispatch(updateCurrentChat(tempMessages[index].messages));
            }
        }
        Dispatch(updateMessages(tempMessages));  
    }
    }
    });

    socket.on('sendContact', ()=>{
        Dispatch(queryContact());
    });

    socket.on('deleteContact', (room)=>{
        socket.emit('leave', room);
        Dispatch(updateCurrentRoom([]));
        Dispatch(updateCurrentChat([]));
        Dispatch(queryContact());
    });

    socket.on('sendUpdateNotification', (item)=>{
        Dispatch(queryGroups());
    });

    socket.on('sendUpdateEliminated', (room)=>{
        socket.emit('leave', room);
        Dispatch(queryGroups());
    });

    const elem = document.getElementById("chatElement");
    return (
        <>
        <div>
            <div className="menuBar" style={{backgroundColor:'#8dc6ff', width: '100%', height: '40px', padding: '', position: 'fixed', top: '0px'}}>
                <MenuBar i18n={props.i18n} t={props.t} language={props.language} languageSet={props.languageSet} socket={socket}/>
            </div>
            <div className="chatBar hide" id="chatBarElement" style={{backgroundColor:'#8dc6ff', width: '100%', height: '40px', padding: '', position: 'fixed', top: '0px'}}>
                <ChatBar i18n={props.i18n} t={props.t} language={props.language} languageSet={props.languageSet} socket={socket}/>
            </div>
            <div className="menuLeft" id="menuLeftElement" style={{backgroundColor:'#34495e', height: 'auto', borderRight: '1px solid #e0e0e0', position: 'fixed', top: '60px'}}>
                <List >
                    <MainUserCard i18n={props.i18n} t={props.t} name={username}/>
                </List>
                <Divider sx={{ bgcolor: "secondary.light" }}/>
                <div style={{padding: '5px'}}>
                    <InputSearch i18n={props.i18n} t={props.t} socket={socket} style={{background:'#34495e', color:'#FFFFFF'}} fullWidth/>
                </div>
                <List style={{height: `calc(100vh - 200px)`, overflowY: 'scroll'}}>
                    {
                        contacts.map((element) =>{
                            return (
                                <div key={element.id} id={element.room} >
                                        <UserCard i18n={props.i18n} element={element} t={props.t} socket={socket} key={element.room} selected= {selected} alreadyread={element.alreadyread} name={element.firstName+' '+element.lastName} src={element.avatar} index={element.room}/>
                                </div>
                            );
                        })
                    }
                    <Divider sx={{ bgcolor: "secondary.light" }}/>
                    <div style={{padding: '0px', height: '50px'}}>
                        <AddGroupDialog i18n={props.i18n} t={props.t} socket={socket}/>
                    </div>
                    {
                        groups.map((element) =>{
                            return (
                                <div key={element.room} id={element.room}>
                                    <GroupCard i18n={props.i18n} t={props.t} key={element.room} element={element} selected= {selected} group={element} alreadyread={element.alreadyread} id={element.room} socket={socket} index={element._id}/>
                                </div>
                            );
                        })
                    }
                </List>
            </div>
            <div className="menuRight" id="chatElement" style={{height:`calc(100vh - 120px)`, overflowY: 'scroll', position: 'fixed', top: '60px', right: '0px'}}>
                    { 
                        currentChat.map((element, index) =>{
                            if (index<currentChat.length-1){
                                return (
                                    <MessageCard key={index} element={element}/>                    
                                );
                            }else{ 
                                let lev; 
                                if (elem){
                                    lev= Math.abs(elem.scrollHeight - elem.scrollTop - elem.clientHeight);    
                                }else{
                                    lev=0;
                                }
                                if (element.origin!=userData._id){
                                    if (lev<10){
                                        return (
                                            <ul key={index}>
                                                <MessageCard key={element.id} element={element}/> 
                                                <li ref={scrollRef} />
                                            </ul>              
                                        );
                                    }else{
                                        return (
                                            <ul key={index}>
                                                <MessageCard key={element.id} element={element}/> 
                                            </ul>
                                        );
                                    }
                                }else{
                                    return (
                                        <ul key={index}>
                                            <MessageCard key={element.id} element={element}/> 
                                            <li ref={scrollRef} />
                                        </ul>              
                                    );
                                }
                            }
                        })
                    }
                </div>
                <div className="menuRightLow close" id="inputElement" style={{padding: '4px', backgroundColor:'#f4f7f7', position: 'fixed', bottom: '0px', right: '0px'}}>
                        <InputMessage i18n={props.i18n} t={props.t} socket={socket} style={{background:'#34495e', color:'#FFFFFF'}} id="outlined-basic-email" fullWidth/>          
                </div>
        </div>
        </>
    );
}
