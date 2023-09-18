import React from 'react'; 
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { GroupNotificationAvatars } from './GroupNotificationAvatars';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

export function ShowGroupNotifications(props) {
    const {requesters, setOpen, onClose, selectedValue} = props;
    const groupRequesters = useSelector(state => state.groupRequesters);
    const userData = useSelector(state => state.userData);
    
    const Dispatch = useDispatch();

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleUpdateNotification= (members)=> {
      console.log('members: ', members);
        props.socket.emit('sendUpdateNotification', members);
    }

    const handleAcceptedListItem = (value)=>{
        let newGroup=[];
        let [room, name]=value;
        
        newGroup = groupRequesters.filter(function (el){
            return el.room == room;
        });

        let formattedMembers = [];
        newGroup[0].members.forEach(element => {
            let member={
                id:element.id
            }
            formattedMembers = formattedMembers.concat(member);
        });     
        let input=formattedMembers;
        Dispatch({type: 'CREATE_GROUP', room, input, name}); 
    }
    
    const handleRejectedListItem = (value)=>{
        let newGroup=[];
        let [room, name]=value;
        // let [room]=value;
        // Dispatch({type: 'DELETE_GROUP_NOTIFICATION', room});

        newGroup = groupRequesters.filter(function (el){
            return el.room == room;
        });

        let formattedMembers = [];
        newGroup[0].members.forEach(element => {
            let member={
                id:element.id
            }
            if (member.id != userData._id){
               formattedMembers = formattedMembers.concat(member);
            }
        });     
        let input=formattedMembers;

        Dispatch({type: 'DELETE_GROUP_NOTIFICATION', room, input, name});
        console.log('formattedMembers: ', formattedMembers);
        if (formattedMembers.length>0){
            setTimeout(() => {
                handleUpdateNotification(formattedMembers);
            }, 5000);
        }
    }

  return (
    <Dialog onClose={handleClose} open={props.selectedValueGroup}>
      <DialogTitle style={{textAlign: 'center'}} >{props.t('show.group.requests')}</DialogTitle>
      <List sx={{ pt: 0 }}>
        {groupRequesters.map((requester) => (
            <ListItem button key={requester.room}> 
            <ListItemAvatar>
                <GroupNotificationAvatars id={requester.room} group={requester} />
            </ListItemAvatar>
            <ListItemText primary={requester.name } />
            <Button style={{marginLeft: '10px'}} onClick={() => handleAcceptedListItem([requester.room, requester.name])} variant="contained">{props.t('request.accept')}</Button>
            {/* <Button style={{marginLeft: '10px'}} onClick={() => handleRejectedListItem([requester.room])} variant="contained">{props.t('request.reject')}</Button> */}
            <Button style={{marginLeft: '10px'}} onClick={() => handleRejectedListItem([requester.room, requester.name])} variant="contained">{props.t('request.reject')}</Button>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

ShowGroupNotifications.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};