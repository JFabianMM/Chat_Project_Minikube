import React from 'react'; 
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import { blue } from '@mui/material/colors';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

export function ShowNotifications(props) {
    const userData = useSelector(state => state.userData);
    const requesters = useSelector(state => state.requesters);

    const Dispatch = useDispatch();

    const { setOpen, onClose, selectedValue} = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };

    const handleContact= (item)=> {
        props.socket.emit('sendContact', item);
    }

    const handleAcceptedListItem = (value)=>{
        let [email,id, firstName, lastName]=value;

        const formData={
            id: id,
            email: email,
            firstName: firstName,
            lastName: lastName
        }

        let userid=userData._id;
        let userfirstName=userData.firstName;
        let userlastName= userData.lastName;
        let contactid=formData.id;
        
        Dispatch({type: 'CREATE_CONTACT', userid, userfirstName, userlastName, contactid});
        let roomToSend={
            room_forNotification:contactid,
            id:userid,
            firstName:userfirstName,
            lastName:userlastName,
            room:userid+contactid
        }
        setTimeout(() => {
            handleContact(roomToSend);
        }, 500);
        
    }

    const handleRejectedListItem = (id)=>{
        let contactid=id;
        Dispatch({type: 'DELETE_NOTIFICATION', contactid});
    }

  return (
    <Dialog onClose={handleClose} open={props.selectedValueContact}>
      <DialogTitle style={{textAlign: 'center'}} >{props.t('show.contact.requests')}</DialogTitle>
      <List sx={{ pt: 0 }}>
        {requesters.map((requester) => (
            <ListItem button key={requester.email}> 
            <ListItemAvatar>
              <Avatar srcSet={requester.avatar} sx={{ bgcolor: blue[100], color: blue[600] } }>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={requester.firstName + ' ' + requester.lastName } />
            <Button style={{marginLeft: '10px'}} onClick={() => handleAcceptedListItem([requester.email,requester.id, requester.firstName, requester.lastName])} variant="contained">{props.t('request.accept')}</Button>
            <Button style={{marginLeft: '10px'}} onClick={() => handleRejectedListItem(requester.id)} variant="contained">{props.t('request.reject')}</Button>
          </ListItem>
        ))}

      </List>
    </Dialog>
  );
}

ShowNotifications.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};