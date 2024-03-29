import React, {useState} from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import { useDispatch, useSelector} from 'react-redux';
import { getCookie } from '../functions/getCookie';
import { newMessage } from '../actions/actions';

export function InputMessage(props) {
  const [inputmessage, setInputmessage] = useState('');
  const currentRoom = useSelector(state => state.currentRoom);
  const element = document.getElementById("inputMessage");

  const Dispatch = useDispatch();
  
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
          let token = getCookie("token");
          let item={
            token:token,
            room:room,
            message:inputmessage
          }
          if (inputmessage.trim().length != 0){
            Dispatch(newMessage(room, inputmessage))
            props.socket.emit('sendMessage', item);
          }
          setInputmessage('');
        }
    }

    if (currentRoom.length>0){
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
    }else{
      return (
        <Paper style={{backgroundColor:'#e9eaed'}} component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center'}}>
            <InputBase disabled style={{backgroundColor:'#e9eaed'}} id="inputMessage" sx={{ ml: 1, flex: 1 }} placeholder={props.t('chat.input.disabled')} inputProps={{ 'aria-label': 'search google maps' }}/>
            <IconButton style={{backgroundColor:'#e9eaed'}}  type="button" sx={{ p: '10px' }} aria-label="search">
            <SendIcon style={{backgroundColor:'#e9eaed'}}/>
            </IconButton>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        </Paper>
      );
    }
}