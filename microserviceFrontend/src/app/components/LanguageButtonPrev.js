import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import { useDispatch } from 'react-redux';
import { updateLanguage } from '../../redux/slice/languageSlice';

export function LanguageButtonPrev() {
  const Dispatch = useDispatch(); 
   
  const onChangeLanguageES = () =>{
      sessionStorage.setItem("language", "es");
      Dispatch(updateLanguage('es'));
  }
  const onChangeLanguageEN = () =>{
      sessionStorage.setItem("language", "en");
      Dispatch(updateLanguage('en'));
  }
  const onChangeLanguageFR = () =>{
    sessionStorage.setItem("language", "fr");
    Dispatch(updateLanguage('fr'));
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