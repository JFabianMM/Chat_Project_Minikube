import React from 'react'; 
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;
  
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export function ContactRequest(props) {
  const array=[1];
  const Dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const getUser = useSelector(state => state.getUser);
  const contacts = useSelector(state => state.contacts);

  const handleNotification= (message)=> {
    props.socket.emit('sendNotification', message);
  }

  const handleClickOpen = () => {
        let email=props.searchmessage;
        try {
          Dispatch({type: 'QUERY_USER', email});
        } catch (error) {
        }
        setOpen(true);
  };
  const handleClose = () => {
      setOpen(false);
  };

  const handleRequestAndClose = (ident) => {
      let contact=[];
      contact = contacts.filter((el) => {
        return el.email == props.searchmessage;
      });
      
      if (contact.length==0){
        let id= ident;
        Dispatch({type: 'MUTATION_CREATE_NOTIFICATION', id });
        handleNotification(id);
      }
      setOpen(false);
  };

  return (
      <div>
          <SearchIcon variant="outlined" onClick={handleClickOpen}/> 
          <BootstrapDialog onClose={handleClose} open={open} aria-labelledby="customized-dialog-title" allign="center">
            {
                        array.map((element) =>{
                          if (`${getUser.firstName}`!='undefined') {
                            return (
                              <BootstrapDialogTitle key={array.indexOf(element)} onClose={handleClose} id="customized-dialog-title" >
                                    {`${getUser.firstName} `}{`${getUser.lastName }`}
                              </BootstrapDialogTitle>
                            )
                          }
                        })
                      }
              <DialogContent allign='center' dividers>
                  <Grid style={{borderRight: '1px solid #e0e0e0'}}>
                      <Grid item xs={12} style={{padding: '10px'}}>
                      {
                        array.map((element) =>{
                          if (`${getUser.email}`!='') {
                            return (
                              <Avatar key={array.indexOf(element)} alt="" srcSet={`${getUser.avatar}`}/>
                            )
                          }
                        })
                      }  
                      </Grid>
                      <Grid item xs={12} style={{padding: '10px'}}>
                      {
                        array.map((element) =>{
                          if (`${getUser.email}`!='') {
                            return (
                              <Typography key={array.indexOf(element)} gutterBottom>
                              {props.t('contact.email')}:  {`${getUser.email}`}
                              </Typography>
                            )
                          }else{
                            return (
                              <Typography key={array.indexOf(element)} gutterBottom>
                                 {props.t('contact.result')}
                              </Typography>
                            )
                          }
                        })
                      }  
                         
                      </Grid>
                  </Grid>
              </DialogContent>
              <DialogActions>
              {
                        array.map((element) =>{
                          if (`${getUser.email}`!='') {
                            return (
                              <Button key={array.indexOf(element)} onClick={()=> handleRequestAndClose(getUser._id, getUser.email)} autoFocus>
                                  {props.t('contact.request')}
                              </Button>
                            )
                          }
                        })
              }
              </DialogActions>
          </BootstrapDialog>
      </div>
  );
}