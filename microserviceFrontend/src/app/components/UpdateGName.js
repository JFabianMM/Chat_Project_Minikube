import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {useDispatch} from 'react-redux';                             
import { updateGroupName } from '../../redux/slice/groupNameSlice'; 
import { useState } from 'react'; 
import { useEffect } from 'react';

export function UpdateGName(props) {
    const Dispatch = useDispatch();   
    const [text1, setText1] = useState("");                     

    useEffect(() => {
      setText1(props.name);
      Dispatch(updateGroupName(props.name));
    }, []);

    const handleChange = (event) => {
        event.preventDefault();
        setText1(event.target.value);
        Dispatch(updateGroupName(event.target.value));   
    };

  return (
    <Box component="form" sx={{'& > :not(style)': { m: 1, width: '25ch' },}} noValidate autoComplete="off">
      <TextField value = {text1} onChange={handleChange} id="standard-basic" label={props.t('update.group.name')} variant="standard" />
    </Box>
  );
}