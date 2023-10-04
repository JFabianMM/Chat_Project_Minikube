import React from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

function SimpleDialog(props) {
    const { onClose, selectedValue, open } = props;
    const groups = useSelector(state => state.groups);
    const userData = useSelector(state => state.userData);

    const Dispatch = useDispatch(); 
    
    const selectedGroup= groups.filter((el) => {
        return el.room == props.room;
    }); 
    const name=selectedGroup[0].name;
 
    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleUpdateNotification= (members)=> {
        props.socket.emit('sendUpdateNotification', members);
    }

    const handleRequestAndClose =(groupRoom)=>{            
        const selectedGroup= groups.filter((el) => {
            return el.room == groupRoom;
        }); 
        
        let formattedMembers = [];
        let members=selectedGroup[0].members;
        let len=members.length;
        for(let i=0;i<len;i++){
            let data={
                id:members[i].id
            }
            if(data.id!=userData._id){
                formattedMembers=formattedMembers.concat(data);
            }
        } 
        const room=groupRoom;
        const input = formattedMembers; 
        Dispatch({type: 'LEAVE_GROUP', room, input});
        props.socket.emit('leave', room);
        setTimeout(() => {
            handleUpdateNotification(formattedMembers);
        }, 2000);
        onClose(selectedValue);
}   

  return (
    <Dialog style={{width: '100%', height: '100%'}} onClose={handleClose} open={open}>
        <DialogTitle>{props.t('group.deletion')} {name}?</DialogTitle>
        <Divider sx={{ height: 0, m: 0.5 }} orientation="horizontal" />
        <List  sx={{ pt: 0, overflow: 'auto', maxHeight: 400, maxWidth: 400}}>
            <ListItem button onClick={() => handleRequestAndClose(props.room)}>
                {props.t('contact.confirm')}
            </ListItem>
        </List>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export function RemoveGroupDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState('');
    const userData = useSelector(state => state.userData);
 
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = (value) => {
        setOpen(false);
        setSelectedValue(value);
    };
    if (props.element.members[0].id != userData._id){
        return (
            <div key={props.room} style={{display:'flex', justifyContent:'flex-end'}}>
                    <button style={{width: '40px', height: '20px', right: '0px', fontSize: 8}} onClick={() => handleClickOpen(props.room)}>{props.t('contact.delete')}</button>
                    <SimpleDialog element={props.element} room={props.room} i18n={props.i18n} t={props.t} selectedValue={selectedValue} open={open} onClose={handleClose} socket={props.socket}/>
            </div>
        );
    }
}