import React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import { useDispatch } from 'react-redux';
import { newLanguage } from '../actions/actions';

export function LanguageButton() {
  const Dispatch = useDispatch();  
  const onChangeLanguageES = () =>{
      let language='es';
      sessionStorage.setItem("language", "es");
      Dispatch(newLanguage(language));
  }
  const onChangeLanguageEN = () =>{
      let language='en';
      sessionStorage.setItem("language", "en");
      Dispatch(newLanguage(language));
  }
  const onChangeLanguageFR = () =>{
    let language='fr';
    sessionStorage.setItem("language", "fr");
    Dispatch(newLanguage(language));
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