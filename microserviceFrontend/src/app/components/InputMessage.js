import * as React from 'react';
import { useState } from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import {useSelector} from 'react-redux';

export function InputMessage(props) {
  const [inputmessage, setInputmessage] = useState('');
  const userData = useSelector(state => state.userData);
  const currentRoom = useSelector(state => state.currentRoom);
  const element = document.getElementById("inputMessage");
  
    const handleChange = (event) => {
        event.preventDefault();
        
        setInputmessage(event.target.value);
    };

    const handleNewMessage= (event)=> {
      if (event){
        event.preventDefault();
      }
      if (currentRoom.length>0){
          element.value = '';
          let room=currentRoom[0].room;
          let item={
            room:room,
            id:userData._id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            message:inputmessage
          }
          if (inputmessage!=''){
              props.socket.emit('sendMessage', item);
          }
          setInputmessage('');
        }
    }

  return (
    <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center'}}>
        <InputBase id="inputMessage" sx={{ ml: 1, flex: 1 }} onKeyDown={(ev) => {
            if (ev.key === 'Enter') {
                ev.preventDefault();
                handleNewMessage();
            }
            }} onChange={handleChange} placeholder={props.t('chat.input.message')} inputProps={{ 'aria-label': 'search google maps' }}/>
        <IconButton onClick={handleNewMessage} type="button" sx={{ p: '10px' }} aria-label="search">
        <SendIcon />
        </IconButton>
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
    </Paper>
  );
} 