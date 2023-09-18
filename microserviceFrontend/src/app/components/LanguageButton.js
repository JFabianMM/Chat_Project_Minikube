import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import { useDispatch } from 'react-redux';

export function LanguageButton() {
  const Dispatch = useDispatch();  
  const onChangeLanguageES = () =>{
      let language='es';
      sessionStorage.setItem("language", "es");
      Dispatch({type: 'NEW_LANGUAGE', language});
  }
  const onChangeLanguageEN = () =>{
      let language='en';
      sessionStorage.setItem("language", "en");
      Dispatch({type: 'NEW_LANGUAGE', language});
  }
  const onChangeLanguageFR = () =>{
    let language='fr';
    sessionStorage.setItem("language", "fr");
    Dispatch({type: 'NEW_LANGUAGE', language});
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
      <Button onClick={onChangeLanguageES}>ES</Button>
      <Button onClick={onChangeLanguageEN}>EN</Button>
      <Button onClick={onChangeLanguageFR}>FR</Button>
    </ButtonGroup>
  </Box>
);
}