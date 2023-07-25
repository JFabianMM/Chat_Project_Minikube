import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import Fab from '@mui/material/Fab';
import Divider from '@mui/material/Divider';
import {InputGroupName} from './InputGroupName';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

let newGroup=[];
function SimpleDialog(props) {
    const { onClose, selectedValue, open } = props;
    const userData = useSelector(state => state.userData);
    const contacts = useSelector(state => state.contacts);
    const groupName = useSelector(state => state.groupName); 

    const Dispatch = useDispatch();

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleGroupNotification= (members)=> {
        props.socket.emit('sendGroupnotification', members);
    }

    const handleListItemClick = (value) => {
        let contact=[];
        const element = document.getElementById(value.id);
        let hasClass= element.classList.contains('contactSelected');
        
        if (hasClass){
            element.classList.remove('contactSelected');
            newGroup= newGroup.filter((el) => {
                return el.id != value.id;
            });
        }else{
            contact= newGroup.filter((el) => {
                return el.id == value.id;
            });
            if (contact.length==0){
                newGroup=newGroup.concat(value);     
            }  
            element.classList.add('contactSelected');
        }
    };

    const handleRequestAndClose =()=>{
        let formattedMembers = [];
        let notificationMembers= [];
        let data={
             id:userData._id
        }

        formattedMembers=formattedMembers.concat(data);
        
        newGroup.forEach(element => {
        data={
                id:element.id
            }
        formattedMembers=formattedMembers.concat(data);
        notificationMembers=notificationMembers.concat(data);
        });
       
        let input = formattedMembers;
        let name= groupName; 
        
        Dispatch({type: 'CREATE_GROUP_NOTIFICATION', input, name});
        
        handleGroupNotification(notificationMembers);
        newGroup=[];
        onClose(selectedValue);
}  

  return (
    <Dialog style={{width: '100%', height: '100%'}} onClose={handleClose} open={open}>
      <DialogTitle>{props.t('add.group.new')}</DialogTitle>
      <Divider sx={{ height: 0, m: 0.5 }} orientation="horizontal" />
      <List  sx={{ pt: 0, overflow: 'auto', maxHeight: 400, maxWidth: 400}}>
        <ListItem>{props.t('add.group.select')}</ListItem>
        {contacts.map((item) => (
          <div key={item.id} id={item.id}>
              <ListItem button onClick={() => handleListItemClick(item)} key={item.id}>
                  <ListItemAvatar>
                      <Avatar srcSet={item.avatar} sx={{ bgcolor: blue[100], color: blue[600] }}>
                          <PersonIcon />
                      </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={item.firstName + ' ' + item.lastName}/>
              </ListItem>
          </div>
        ))}
        <Divider sx={{ height: 0, m: 0.5 }} orientation="horizontal" />
        <InputGroupName i18n={props.i18n} t={props.t}/>
        <Divider sx={{ height: 0, m: 0.5 }} orientation="horizontal" />
        <ListItem button onClick={handleRequestAndClose}>
            {props.t('add.group.create')}
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

export function AddGroupDialog(props) {
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
      <ListItem style={{leftpadding:'10px', width: '100%', height: '100%'}} >
          <ListItemAvatar onClick={handleClickOpen}>
          <Fab size="small"  color="primary" aria-label="add">
                <AddIcon />
         </Fab>
          </ListItemAvatar>
          <ListItemText>
          <Typography color="primary">
              {props.t('chat.add.group')}
            </Typography>

          </ListItemText>
          
        </ListItem>
      <SimpleDialog i18n={props.i18n} t={props.t} selectedValue={selectedValue} open={open} onClose={handleClose} socket={props.socket}/>
    </div>
  );
}
