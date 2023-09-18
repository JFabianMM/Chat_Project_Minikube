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
import {LanguageButtonPrev} from './LanguageButtonPrev';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { updatePage } from '../../redux/slice/pageSlice';
import { updateErrorNotification } from '../../redux/slice/errorNotificationSlice';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit">
        ChatProject
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();
export function SignIn(props) {
    const errorNotification = useSelector(state => state.errorNotification);

    let array= ['1'];
    const Dispatch = useDispatch();     
    
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const formData={
            email: data.get('email'),
            password: data.get('password')
        }

        let email=formData.email;
        let password=formData.password;
        if (password == "")  {
            Dispatch(updateErrorNotification('fillPassword'));
        }
        if (email == "")  {
            Dispatch(updateErrorNotification('fillEmail'));
        }
 
        if (email != "" && password != "")  {
            Dispatch(updateErrorNotification(''));
            Dispatch({type: 'QUERY_LOGIN', email, password});
        }
    };  

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <LanguageButtonPrev i18n={props.i18n} t={props.t} />
                <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {props.t('signin.signin')}
                    </Typography>
                    <div style={{margin:'10px'}}></div> 
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField xs={12} required fullWidth id="email" label={props.t('signin.email')} name="email" autoComplete="email" autoFocus /> 
                                {
                                    array.map((element) =>{
                                        if (errorNotification=='fillEmail') {
                                            return (
                                                <Typography key={element.indexOf} style={{color:'red'}}>
                                                    {props.t('signin.error.fillEmail')}
                                                </Typography>
                                            );
                                        }
                                    })
                                }
                        </Grid>
                        <Grid item xs={12}>
                        <TextField required fullWidth name="password" label={props.t('signin.password')} type="password" id="password" autoComplete="current-password"/>                        
                                {
                                    array.map((element) =>{
                                        if (errorNotification=='fillPassword') {
                                            return (
                                                <Typography key={element.indexOf} style={{color:'red'}}>
                                                    {props.t('signin.error.fillPassword')}
                                                </Typography>
                                            );
                                        }
                                        if (errorNotification=='doesnotmatch' || errorNotification=='doesnotexist'){
                                            return (
                                                <Typography key={element.indexOf} style={{color:'red'}}>
                                                    {props.t('signin.error.incorrect')}
                                                </Typography>
                                            );
                                        }
                                    })
                                }
                        </Grid>
                    </Grid>
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            {props.t('signin.signin.button')}
                        </Button>
                        <Grid container>
                            <Grid item xs>
                            </Grid>
                            <Grid item>
                                <Link onClick={() => {
                                    Dispatch(updateErrorNotification(''));
                                    Dispatch(updatePage('signUp'));
                                }
                                } variant="body2">
                                    {props.t('signin.dont.have.account')}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}