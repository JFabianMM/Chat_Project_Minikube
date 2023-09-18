import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { updateCurrentRoom } from '../../redux/slice/currentRoomSlice';
import { updateCurrentChat } from '../../redux/slice/currentChatSlice';
import { updateContacts } from '../../redux/slice/contactsSlice';
import { useEffect } from 'react';
import { Typography } from '@mui/material';

export function UserCard(props){
    const rooms = useSelector(state => state.rooms); 
    const messages = useSelector(state => state.messages);
    const contacts = useSelector(state => state.contacts);
    const userData = useSelector(state => state.userData);

    const Dispatch = useDispatch();

    let name = props.name;
    if (name.length>20){
        name = name.slice(0, 20)+ ' ...';
        console.log('name', name);
    }
    
    function updateChatRooms(ids) {
        let newCurrentroom = rooms.filter(function (el){
            return el.room == ids;
        });
        if (newCurrentroom.length>0){
            Dispatch(updateCurrentRoom(newCurrentroom));
            let tempMessages=messages;
            let index = tempMessages.findIndex(function (el){
                return el.room == newCurrentroom[0].room;
            });
            Dispatch(updateCurrentChat(messages[index].messages));
        }
    }

    useEffect(() => {
        if (props.selected==props.index){
            setTimeout(() => {
                const element = document.getElementById(props.index);
                if (element){
                    element.classList.add("selected");
                }             
                updateChatRooms(props.index);
              }, 20); 
        }
      }, []);


    function handleClickUserCard(e) {
        e.preventDefault();   
        const elements = document.querySelectorAll(".selected");
        if (elements.length>0) elements.forEach(element => {
                element.classList.remove("selected");
        });

        const element = document.getElementById(props.index);
        element.classList.add("selected");

        updateChatRooms(e.target.parentNode.id);
  
        let index=-1;
        index = contacts.findIndex(function (el){
                return el.room == props.index;
        });

        if (index>=0){
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
            cont[index].alreadyread = 'true';
            Dispatch(updateContacts(cont));
            let id= userData._id;
            let room= props.index;
            let status='true';
            //Dispatch({type: 'CREATE_NEW_STATUS', id, room, status});
            Dispatch({type: 'NEW_STATUS', id, room, status});
        }
    };
    
    if (props.element.status=='pending'){
        return (
            <ListItem style={{allign:'center'}} id={props.index}  >
                <ListItemIcon id={props.index} >
                    <Avatar  id={props.index}   alt={name} srcSet={props.src} />
                </ListItemIcon>
                <ListItemText id={props.index} style={{color:'#FFFFFF'}} primary={name}></ListItemText>
                <ListItemText secondary={<Typography variant="caption" style={{ color: 'green' }}>{props.t('chat.pending')}</Typography>} ></ListItemText>
            </ListItem>
        )
    }else{
        if (props.alreadyread=='false'){
            return (
                <ListItem style={{allign:'center'}} id={props.index} button onClick={handleClickUserCard} >
                    <ListItemIcon id={props.index} onClick={handleClickUserCard}>
                        <Avatar  id={props.index}   alt={name} srcSet={props.src} />
                    </ListItemIcon>
                    <ListItemText onClick={handleClickUserCard} id={props.index} style={{color:'#FFFFFF'}} primary={name}></ListItemText>
                    <ListItemText secondary={<Typography variant="caption" style={{ color: 'green' }}>{props.t('chat.new')}</Typography>} ></ListItemText>
                </ListItem>
            )
        }else{
            return (
                <ListItem style={{allign:'center'}} id={props.index} button onClick={handleClickUserCard} >
                    <ListItemIcon id={props.index} onClick={handleClickUserCard}>
                        <Avatar  id={props.index}   alt={name} srcSet={props.src} />
                    </ListItemIcon>
                    <ListItemText onClick={handleClickUserCard} id={props.index} style={{color:'#FFFFFF'}} primary={name}></ListItemText>
                </ListItem>
            )    
        }
    }
  }






