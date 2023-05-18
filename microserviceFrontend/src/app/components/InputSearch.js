import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import { ContactRequest } from './ContactRequest'; 

export function InputSearch(props) {
    const [searchmessage, setSearchmessage] = useState('');
    
    const handleChange = (event) => {
        event.preventDefault();
        setSearchmessage(event.target.value);
    };

    const searchClean = (event) => {
        event.preventDefault();
        let elem = document.getElementById("contactRequest");
        elem.value = '';
    };

  return (
      <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center'}}>
          <InputBase id="contactRequest" sx={{ ml: 1, flex: 1 }} placeholder={props.t('chat.input.search')} inputProps={{ 'aria-label': 'search google maps' }}
            onKeyDown={(ev) => {
                if (ev.key === 'Enter') {
                  ev.preventDefault();
                }
              }} onChange={handleChange}/>
          <IconButton onClick={searchClean} type="button" sx={{ p: '10px' }} aria-label="search">
              <ContactRequest i18n={props.i18n} t={props.t} socket={props.socket} searchmessage={searchmessage}/>
          </IconButton>
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      </Paper>
  );
}