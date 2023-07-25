import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {useDispatch} from 'react-redux';                             
import { updateGroupName } from '../../redux/slice/groupNameSlice';  

export function UpdateGName(props) {
    const Dispatch = useDispatch();                        
    const handleChange = (event) => {
        event.preventDefault();
        Dispatch(updateGroupName(event.target.value));   
    };

  return (
    <Box component="form" sx={{'& > :not(style)': { m: 1, width: '25ch' },}} noValidate autoComplete="off">
      <TextField onChange={handleChange} id="standard-basic" label={props.t('update.group.name')} variant="standard" />
    </Box>
  );
}