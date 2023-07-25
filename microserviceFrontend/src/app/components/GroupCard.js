import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { GroupAvatars } from './GroupAvatars';
import { useSelector } from 'react-redux';
import { updateCurrentRoom } from '../../redux/slice/currentRoomSlice';
import { useDispatch } from 'react-redux';
import { updateCurrentChat } from '../../redux/slice/currentChatSlice';
import { updateMessages } from '../../redux/slice/messagesSlice';
import { updateGroups } from '../../redux/slice/groupsSlice';
import { useEffect } from 'react';
import { Typography } from '@mui/material';

import { EditDialog } from './EditDialog';                  
import {socket} from '../functions/socket';               

export function GroupCard(props){
    const rooms = useSelector(state => state.rooms);
    const messages = useSelector(state => state.messages);
    const userData = useSelector(state => state.userData);
    const groups = useSelector(state => state.groups);

    const Dispatch = useDispatch();

    function updateChatRooms(ids) {
        let newCurrentroom = rooms.filter(function (el){
            return el.id == ids;
         });
 
         Dispatch(updateCurrentRoom(newCurrentroom));
         Dispatch(updateMessages(messages));
 
         let index = messages.findIndex(function (el){
             return el.room == newCurrentroom[0].room;
         });
         Dispatch(updateCurrentChat(messages[index].messages));
    }

    useEffect(() => {
        if (props.selected==props.id){
            setTimeout(() => {
                const element = document.getElementById(props.id);
                element.classList.add("selected");
                updateChatRooms(props.id);
              }, 20); 
        }
      }, []);

    function handleClickGroupCard(e) {
        e.preventDefault();
        const elements = document.querySelectorAll(".selected");
        if (elements.length>0) elements.forEach(element => {
                element.classList.remove("selected");
        });
        localStorage.setItem('elementId', props.id);
        const element = document.getElementById(props.id);
        element.classList.add("selected");
        
        updateChatRooms(props.group.room);

        let index=-1;
        index = groups.findIndex(function (el){
                return el.room == props.id;
        });
        if (index>=0){
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
            gro[index].alreadyread = true;      
            Dispatch(updateGroups(gro));
            let id= userData._id;
            let room= props.id;
            let status='true';
            Dispatch({type: 'CREATE_NEW_STATUS', id, room, status});
        }
    };

    if (props.alreadyread==false){     
    return (
            <ListItem style={{allign:'center'}} id={props.index} button onClick={handleClickGroupCard} >
                <ListItemIcon>
                    <GroupAvatars id={props.index} group={props.group} />
                </ListItemIcon>
                <ListItemText id={props.index} style={{color:'#FFFFFF', padding: "10px"}} primary={props.group.name}></ListItemText>
                <ListItemText secondary={<Typography variant="caption" style={{ color: 'green' }}>{props.t('chat.new')}</Typography>} ></ListItemText>
                <EditDialog element={props.element} room={props.id} i18n={props.i18n} t={props.t} socket={socket}/>
            </ListItem>
    )
    }else{
        return (
            <ListItem style={{allign:'center'}} id={props.index} button onClick={handleClickGroupCard} >
                <ListItemIcon>
                    <GroupAvatars id={props.index} group={props.group} />
                </ListItemIcon>
                <ListItemText id={props.index} style={{color:'#FFFFFF', padding: "10px"}} primary={props.group.name}></ListItemText>
                <EditDialog element={props.element} room={props.id} i18n={props.i18n} t={props.t} socket={socket}/>
            </ListItem>
    )
    }   
  }
