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
import { blue } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import {UpdateGName} from './UpdateGName';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

let newGroup=[];
function SimpleDialog(props) {
    const { onClose, selectedValue, open } = props;
    const userData = useSelector(state => state.userData);
    const contacts = useSelector(state => state.contacts);
    const groupName = useSelector(state => state.groupName); 
    const groups = useSelector(state => state.groups);
    
    const selectedGroup= groups.filter((el) => {
        return el.room == props.room;
    }); 
    const members=selectedGroup[0].members;
    const name=selectedGroup[0].name;

    let contactLen=contacts.length;
    let newContacts=[];
    for(let i=0; i<contactLen; i++){
        let cont={
            id:contacts[i].id,
            room:contacts[i].room,
            status:contacts[i].status,
            email:contacts[i].email,
            firstName:contacts[i].firstName,
            lastName:contacts[i].lastName,
            alreadyread:contacts[i].alreadyread,
            avatar:contacts[i].avatar,
            marked: 'no'
        }
        newContacts=newContacts.concat(cont);
    }
    let len = members.length;
    if (len>0){
        for (let i=0; i<len; i++){
            let index= newContacts.findIndex((el) => el.id == members[i].id); // 1
            if (index>=0){
                newContacts[index].marked='yes';
            }
        }
    }
    
    const Dispatch = useDispatch();
    const handleClose = () => {
        onClose(selectedValue);
        newGroup=[];
    };
    const handleGroupNotification= (members)=> {
        props.socket.emit('sendGroupnotification', members);
    }
    const handleUpdateNotification= (members)=> {
        props.socket.emit('sendUpdateNotification', members);
    }

    const handleListItemClick = (value) => {      
        let contact=[];
        newGroup=[];
        let len = newContacts.length;
        for (let i=0;i<len;i++){
            const element = document.getElementById(newContacts[i].id);
            let hasClass= element.classList.contains('contactSelected');
            if (hasClass){
                newGroup=newGroup.concat(newContacts[i]);   
            }
        }

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
                element.classList.add("contactSelected");
        }
    };

    const handleRequestAndClose =(groupRoom)=>{
        if (newGroup.length==0){
            let len = newContacts.length;
            for (let i=0;i<len;i++){
                const element = document.getElementById(newContacts[i].id);
                let hasClass= element.classList.contains('contactSelected');
                if (hasClass){
                    newGroup=newGroup.concat(newContacts[i]);   
                }
            }
        }
        
        let formattedMembers = [];
        let data={
                id:userData._id
        }
        formattedMembers=formattedMembers.concat(data);
        newGroup.forEach(element => {
            data={
                id:element.id
            }
        formattedMembers=formattedMembers.concat(data);
        });

        const room=groupRoom;
        const input = formattedMembers;
        const name= groupName; 

        Dispatch({type: 'EDIT_GROUP', room, input, name});
        let group = groups.find(element => element.room == room);
        let formerMembers=group.members.filter((el) => {
            return el.id != userData._id;
        });
    
        let newMembers=formattedMembers.filter((el) => {
            return el.id != userData._id;
        });

        let formerLen= formerMembers.length;
        let newLen=newMembers.length;
        let eliminated=[];
        let added=[];
        let stay=[];
        for (let i=0;i<formerLen; i++){    
                let found = newMembers.find(element => element.id == formerMembers[i].id);
                if (!found){
                        eliminated=eliminated.concat(formerMembers[i]);
                }else{
                        stay=stay.concat(formerMembers[i]);
                }
        }  
        for (let i=0;i<newLen; i++){  
                const found = formerMembers.find(element => element.id == newMembers[i].id);
                if (!found){
                        added=added.concat(newMembers[i]);
                }
        }   
        let notificationMembers= [];
        if (added.length>0){
            added.forEach(element => {
                data={
                    id:element.id
                }
            notificationMembers=notificationMembers.concat(data);
            });
            handleGroupNotification(notificationMembers);
        }
        
        let eliminatedMembers= [];
        if (eliminated.length>0){
            eliminated.forEach(element => {
                data={
                    id:element.id
                }
                eliminatedMembers=eliminatedMembers.concat(data);
            });
            setTimeout(() => {
                handleUpdateNotification(eliminatedMembers);
            }, 1000); 
        }
        let stayMembers= [];
        if (stay.length>0){
            stay.forEach(element => {
                data={
                    id:element.id
                }
                stayMembers=stayMembers.concat(data);
            });
            setTimeout(() => {
                handleUpdateNotification(stayMembers);
            }, 1000);
        }
        newGroup=[];
        onClose(selectedValue);
}   

  return (
    <Dialog style={{width: '100%', height: '100%'}} onClose={handleClose} open={open}>
        <DialogTitle>{props.t('update.group.new')}</DialogTitle>
        <Divider sx={{ height: 0, m: 0.5 }} orientation="horizontal" />
        <List  sx={{ pt: 0, overflow: 'auto', maxHeight: 400, maxWidth: 400}}>
            <ListItem>{props.t('add.group.select')}</ListItem>
            {newContacts.map((item) => {
                if (item.marked=='yes'){
                    return (
                        <div className='contactSelected' id={item.id} key={item.id}>
                            <ListItem button  onClick={() => handleListItemClick(item)} >
                                <ListItemAvatar>
                                    <Avatar srcSet={item.avatar} sx={{ bgcolor: blue[100], color: blue[600] }}>
                                        <PersonIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={item.firstName + ' ' + item.lastName}/>
                            </ListItem>
                    </div>
                  )
                }else{
                    return (
                        <div id={item.id} key={item.id}>
                            <ListItem button  onClick={() => handleListItemClick(item)} >
                                <ListItemAvatar>
                                    <Avatar srcSet={item.avatar} sx={{ bgcolor: blue[100], color: blue[600] }}>
                                        <PersonIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={item.firstName + ' ' + item.lastName}/>
                            </ListItem>
                        </div>
                    )
                }
            }
            )}
            <Divider sx={{ height: 0, m: 0.5 }} orientation="horizontal" />
            <UpdateGName i18n={props.i18n} t={props.t} name={name}/>
            <Divider sx={{ height: 0, m: 0.5 }} orientation="horizontal" />
            <ListItem button onClick={() => handleRequestAndClose(props.room)}>
                {props.t('update.group.new')}
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

export function EditDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState('');
    const userData = useSelector(state => state.userData);
 
    const handleClickOpen = (room) => {
        newGroup=[];
        setOpen(true);
    };
    const handleClose = (value) => {
        setOpen(false);
        setSelectedValue(value);
    };
    if (props.element.members[0].id == userData._id){
        return (
            <div key={props.room} style={{display:'flex', justifyContent:'flex-end'}}>
                <button style={{width: '40px', height: '20px', right: '0px', fontSize: 8}}  onClick={() => handleClickOpen(props.room)}>{props.t('update.group.edit')}</button>
                <SimpleDialog room={props.room} i18n={props.i18n} t={props.t} selectedValue={selectedValue} open={open} onClose={handleClose} socket={props.socket}/>
            </div>
        );
    }
}
