import React from 'react'; 
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { updatePage } from '../../redux/slice/pageSlice';
import { updateErrorNotification } from '../../redux/slice/errorNotificationSlice';
const validator = require('validator');

import {LanguageButtonPrev} from './LanguageButtonPrev'

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="#">
                ChatProject
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}
const theme = createTheme();

export function SignUp(props) {
    const errorNotification = useSelector(state => state.errorNotification);
    const Dispatch = useDispatch();
    let array= ['1'];

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let email=data.get('email');
        let password=data.get('password');
        let confirmpassword=data.get('confirmpassword');
        let firstName=data.get('firstName');
        let lastName=data.get('lastName');

        let errorFlag=0;
        const result = /^(?=.*[0-9])(?=.*[A-Z])(?!.* ).{6,80}$/.test(password);

        if (confirmpassword == "")  {
            errorFlag=1;
            Dispatch(updateErrorNotification('fillConfirmPassword'));
        }
        if (password == "")  {
            errorFlag=1;
            Dispatch(updateErrorNotification('fillPassword'));
        }
        if (email == "")  {
            errorFlag=1;
            Dispatch(updateErrorNotification('fillEmail'));
        }
        if (lastName == "")  {
            errorFlag=1;
            Dispatch(updateErrorNotification('fillLastName'));
        }
        if (firstName == "")  {
            errorFlag=1;
            Dispatch(updateErrorNotification('fillFirstName'));
        }
        if (lastName.length > 20){
            errorFlag=1;
            Dispatch(updateErrorNotification('lastNameLength'));
        }
        if (firstName.length > 20){
            errorFlag=1;
            Dispatch(updateErrorNotification('firstNameLength'));
        }
        if (result===false && password != ""){
            errorFlag=1;
            Dispatch(updateErrorNotification('characters'));
        }
        if(!validator.isEmail(email) && email != ""){
            errorFlag=1;
            Dispatch(updateErrorNotification('invalid'));
        }
        if (email != "" && password != "" && firstName != "" && lastName != "" && confirmpassword != "")  {
            if (password != confirmpassword){
                errorFlag=1;
                Dispatch(updateErrorNotification('match'));
            }
        }
        if (errorFlag==0){
            Dispatch(updateErrorNotification(''));
            Dispatch({type: 'MUTATION_SIGNUP', email, password, firstName, lastName});
        }
    };  
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <LanguageButtonPrev i18n={props.i18n} t={props.t} />
                <Box sx={{marginTop: 8,display: 'flex',flexDirection: 'column',alignItems: 'center'}}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {props.t('signup.signup')}
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField autoComplete="given-name" name="firstName" required fullWidth id="firstName" label={props.t('signup.first.name')} autoFocus/>
                                {
                                    array.map((element) =>{
                                        if (errorNotification=='fillFirstName') {
                                            return (
                                                <Typography key={element.indexOf} style={{color:'red'}}>
                                                    {props.t('signup.error.fillFirstName')}
                                                </Typography>
                                            );
                                        }
                                        if (errorNotification=='firstNameLength') {
                                            return (
                                                <Typography key={element.indexOf} style={{color:'red'}}>
                                                    {props.t('signup.error.firstNameLength')}
                                                </Typography>
                                            );
                                        }
                                    })
                                }

                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField required fullWidth id="lastName" label={props.t('signup.last.name')} name="lastName" autoComplete="family-name"/>
                                {
                                    array.map((element) =>{
                                        if (errorNotification=='fillLastName') {
                                            return (
                                                <Typography key={element.indexOf} style={{color:'red'}}>
                                                    {props.t('signup.error.fillLastName')}
                                                </Typography>
                                            );
                                        }
                                        if (errorNotification=='lastNameLength') {
                                            return (
                                                <Typography key={element.indexOf} style={{color:'red'}}>
                                                    {props.t('signup.error.lastNameLength')}
                                                </Typography>
                                            );
                                        }
                                    })
                                    }
                            </Grid>
                            <Grid item xs={12}>
                                <TextField required fullWidth id="email" label={props.t('signup.email')} name="email" autoComplete="email"/>
                                {
                                    array.map((element) =>{
                                        if (errorNotification=='fillEmail') {
                                            return (
                                                <Typography key={element.indexOf} style={{color:'red'}}>
                                                    {props.t('signup.error.fillEmail')}
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
                                        if (errorNotification=='exist') {
                                            return (
                                                <Typography key={element.indexOf} style={{color:'red'}}>
                                                    {props.t('signup.error.exist')}
                                                </Typography>
                                            );
                                        }
                                    })
                                    }
                               
                            </Grid>
                            <Grid item xs={12}>
                                <TextField required fullWidth name="password" label={props.t('signup.password')} type="password" id="password" autoComplete="new-password"/>          
                                {
                                    array.map((element) =>{
                                        if (errorNotification=='fillPassword') {
                                            return (
                                                <Typography key={element.indexOf} style={{color:'red'}}>
                                                    {props.t('signup.error.fillPassword')}
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
                            </Grid>
                            <Grid item xs={12}>
                                <TextField required fullWidth name="confirmpassword" label={props.t('signup.confirm.password')} type="password" id="confirmpassword" autoComplete="new-password"/>
                                {
                                    array.map((element) =>{
                                        if (errorNotification=='fillConfirmPassword') {
                                            return (
                                                <Typography key={element.indexOf} style={{color:'red'}}>
                                                    {props.t('signup.error.fillConfirmPassword')}
                                                </Typography>
                                            );
                                        }
                                    })
                                    }
                            </Grid>
                        </Grid>
                                {
                                    array.map((element) =>{
                                        if (errorNotification=='match') {
                                            return (
                                                <Typography key={element.indexOf} style={{color:'red'}}>
                                                    {props.t('signup.error.match')}
                                                </Typography>
                                            );
                                        }    
                                    })
                                }
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            {props.t('signup.signup.button')}
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link onClick={() => {
                                    Dispatch(updateErrorNotification(''));
                                    Dispatch(updatePage('signIn'));
                            }} variant="body2">    
                                    {props.t('signup.have.account')}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>
  );
}