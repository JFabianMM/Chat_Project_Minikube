import React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import { updateCurrentChat, updateCurrentRoom } from '../../redux/slice';
import { useDispatch } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export function ReturnButton() {
    const Dispatch= useDispatch();
  const onReturn = () =>{
        const inputElement = document.getElementById("inputElement");
        inputElement.classList.remove("open");
        const chatBarElement = document.getElementById("chatBarElement");
        chatBarElement.classList.add("hide");
        const menuLeftElement = document.getElementById("menuLeftElement");
        menuLeftElement.classList.remove("menuHide");
        const chatElement = document.getElementById("chatElement");
        chatElement.classList.remove("appear");

        Dispatch(updateCurrentRoom([]));
        Dispatch(updateCurrentChat([]));

        const elements = document.querySelectorAll(".selected");
        if (elements.length>0) elements.forEach(element => {
                element.classList.remove("selected");
        });
        localStorage.setItem('elementId', '0');
  }

return (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      '& > *': {
        m: 1,
      },
    }}
  >
    <ButtonGroup style={{backgroundColor:'white'}} variant="text" aria-label="text button group">
      <Button onClick={onReturn}>
        <ArrowBackIcon></ArrowBackIcon>
      </Button>
    </ButtonGroup>
  </Box>
);
}