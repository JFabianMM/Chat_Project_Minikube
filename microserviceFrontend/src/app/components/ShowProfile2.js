import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useSelector, useDispatch } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StandardImage, UploadButton } from '../components';
import { updateAvatar, updateFile } from '../../redux/slice';
import { uploadFile } from '../actions/actions';

function SimpleDialog(props) {
    const { onClose, selectedValue, open } = props;
    const file = useSelector(state => state.file);

    const Dispatch = useDispatch();

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleSaveAndClose =(e)=>{
        e.preventDefault();
        Dispatch(uploadFile(file));
        Dispatch(updateAvatar(file));
        Dispatch(updateFile({}));
        onClose(selectedValue);
    }

  return (
    <Dialog style={{width: '100%', height: '100%'}} onClose={handleClose} open={open}>
      <List  sx={{ pt: 0, overflow: 'auto', maxHeight: 470, maxWidth: 300}}> 
    
      <DialogTitle>{props.t('menu.bar.picture.profile')}</DialogTitle>
      <Divider sx={{ height: 0, m: 0.5 }} orientation="horizontal" />
      
    <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box sx={{display: 'flex',flexDirection: 'column',alignItems: 'center'}}>
                <Box component="form" noValidate sx={{ mt: 3 }}>  
                    <StandardImage i18n={props.i18n} t={props.t} ></StandardImage>  
                    <UploadButton i18n={props.i18n} t={props.t}/>
                    <Divider sx={{ height: 0, m: 0.5 }} orientation="horizontal" />
                    <Button onClick={handleSaveAndClose} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        {props.t('menu.profile.save')}
                    </Button>
                </Box>
            </Box>
        </Container>
    </ThemeProvider>
      </List>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

const theme = createTheme();

export function ShowProfile2(props) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div >
            <ListItemText onClick={handleClickOpen}>
                <Typography>
                    {props.t('menu.bar.picture.profile')}
                </Typography>
            </ListItemText>
      <SimpleDialog i18n={props.i18n} t={props.t} selectedValue={selectedValue} open={open} onClose={handleClose} socket={props.socket}/>
    </div>
  );
}