import React from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { updateErrorNotification } from '../../redux/slice';
import { updateUserData } from '../actions/actions';

function SimpleDialog(props) {
    const { onClose, selectedValue, open } = props;

    const errorNotification = useSelector(state => state.errorNotification);
    const Dispatch = useDispatch();

    let array= ['1'];
    const handleSubmit = (event) => {
        event.preventDefault();
        Dispatch(updateErrorNotification(''));
        const data = new FormData(event.currentTarget);
        let password=data.get('password');
        let confirmpassword=data.get('confirmpassword');
        let firstName=data.get('firstName');
        let lastName=data.get('lastName');

        let errorflag=0;
        const result = /^(?=.*[0-9])(?=.*[A-Z])(?!.* ).{6,80}$/.test(password);
        
        if (password != "" || confirmpassword != "")  {
            if (password != confirmpassword){
                errorflag=1;
                Dispatch(updateErrorNotification('match'));        
            }else{
                if (result==false){
                   errorflag=1;
                   Dispatch(updateErrorNotification('characters'));
                }
            }            
        }

        if (errorflag==0){
           Dispatch(updateErrorNotification(''));
           Dispatch(updateUserData(password, firstName, lastName));
           onClose(selectedValue);
        }          
    };

    const handleClose = () => {
        onClose(selectedValue);
    };

  return (
    <Dialog style={{width: '100%', height: '100%'}} onClose={handleClose} open={open}>
      <DialogTitle>{props.t('menu.bar.information.profile')}</DialogTitle>
      <Divider sx={{ height: 0, m: 0.5 }} orientation="horizontal" />
      <List  sx={{ pt: 0, overflow: 'auto', maxHeight: 600, maxWidth: 300}}> 
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box sx={{display: 'flex',flexDirection: 'column',alignItems: 'center'}}>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField autoComplete="given-name" name="firstName" fullWidth id="firstName" label={props.t('menu.profile.new.first.name')} autoFocus/>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth id="lastName" label={props.t('menu.profile.new.last.name')} name="lastName" autoComplete="family-name"/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth name="password" label={props.t('menu.profile.new.password')} type="password" id="password" autoComplete="new-password"/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField required fullWidth name="confirmpassword" label={props.t('menu.profile.new.confirm.password')} type="password" id="confirmpassword" autoComplete="new-password"/>
                            </Grid>
                        </Grid>
                        <List>
                                {
                                    array.map((element) =>{
                                        if (errorNotification=='match') {
                                            return (
                                                <Typography key={element.indexOf} style={{color:'red'}}>
                                                    {props.t('signup.error.match')}
                                                </Typography>
                                            );
                                        }
                                            
                                        if (errorNotification=='fill') {
                                                return (
                                                    <Typography key={element.indexOf} style={{color:'red'}}>
                                                        {props.t('signup.error.fill')}
                                                    </Typography>
                                                );
                                        }
                                        if (errorNotification=='invalid') {
                                            return (
                                                <Typography key={element.indexOf} style={{color:'red'}}>
                                                    {props.t('signup.error.invalid')}
                                                </Typography>
                                            );
                                        }
                                        if (errorNotification=='characters') {
                                            return (
                                                <Typography key={element.indexOf} style={{color:'red'}}>
                                                    {props.t('signup.error.characters')}
                                                </Typography>
                                            );
                                        }
                                        
                                    })
                                }
                            </List>
                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
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
export function ShowProfileInformation(props) {
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
                    {props.t('menu.bar.information.profile')}
                </Typography>
            </ListItemText>
      <SimpleDialog i18n={props.i18n} t={props.t} selectedValue={selectedValue} open={open} onClose={handleClose} socket={props.socket}/>
    </div>
  );
}








