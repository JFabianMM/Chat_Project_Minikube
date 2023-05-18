import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import { useDispatch } from 'react-redux';
import { updateLanguage } from '../../redux/slice/languageSlice';

export function LanguageButton() {
  const Dispatch = useDispatch();  
  const onChangeLanguageES = () =>{
      Dispatch(updateLanguage('es'));
  }
  const onChangeLanguageEN = () =>{
      Dispatch(updateLanguage('en'));
  }
  const onChangeLanguageFR = () =>{
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
      <Button onClick={onChangeLanguageFR}>RF</Button>
    </ButtonGroup>
  </Box>
);
}