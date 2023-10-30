import React from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import { useDispatch } from 'react-redux';
import { deleteContact } from '../actions/actions';

function SimpleDialog(props) {
    const { onClose, open } = props;

    const Dispatch = useDispatch();     
    const handleClose = () => {
        onClose();
    };

    const handleContact= (item)=> {
        props.socket.emit('deleteContact', item);
    }

    const handleRequestAndClose =()=>{  
        let room=props.element.room;
        let contactid=props.element.id;
        Dispatch(deleteContact(contactid, room));
        let roomToSend={
            room_forNotification:room,
        }
        setTimeout(() => {
                 handleContact(roomToSend);
        }, 2000);
        onClose();
    }   

  return (
    <Dialog style={{width: '100%', height: '100%'}} onClose={handleClose} open={open}>
        <DialogTitle >{props.t('contact.deletion')}</DialogTitle>
        <Divider sx={{ height: 0, m: 0.5 }} orientation="horizontal" />
        <List  sx={{ pt: 0, overflow: 'auto', maxHeight: 400, maxWidth: 400}}>
            <ListItem button onClick={() => handleRequestAndClose()}>
                {props.t('contact.confirm')}
            </ListItem>
        </List>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export function RemoveContactDialog(props) {
    const [open, setOpen] = React.useState(false);
 
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return (
            <div style={{display:'flex', justifyContent:'flex-end'}}>
                    <button style={{width: '40px', height: '20px', right: '0px', fontSize: 8}} onClick={() => handleClickOpen()}>{props.t('contact.delete')}</button>
                    <SimpleDialog element={props.element} i18n={props.i18n} t={props.t} open={open} onClose={handleClose} socket={props.socket}/>
            </div>
    );
}