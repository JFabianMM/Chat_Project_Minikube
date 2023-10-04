import React from 'react'; 
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { GroupAvatars } from './GroupAvatars';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import { ReturnButton } from './ReturnButton';
import { useSelector} from 'react-redux';

export function ChatBar(props) {
    const currentRoom = useSelector(state =>state.currentRoom);

    let room;
    if (currentRoom.length>0){
        room= currentRoom[0].room;
    }
    const contacts = useSelector(state => state.contacts);
    const groups = useSelector(state => state.groups);
    let obtainedContact;
    let obtainedGroup;
    let name;
    if(room){
        obtainedContact= contacts.filter((el) => {
            return el.room == room;
        });
        obtainedGroup= groups.filter((el) => {
            return el.room == room;
        });
    }
 
    if (obtainedGroup){
        if (obtainedGroup.length>0){
            name = obtainedGroup[0].name;
            if (name.length>12){
                name = name.slice(0, 12)+ '...';
            }
            return (
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="static" style={{height: '60px'}}>
                        <Toolbar>
                            <ReturnButton i18n={props.i18n} t={props.t} language={props.language} languageSet={props.languageSet}/>
                            <Divider style={{paddingLeft:'0px' }} sx={{ height: 28, m: 0.5 }} orientation="vertical" /> 
                            <GroupAvatars id={1} group={obtainedGroup[0]} />
                            <ListItemText id={props.index} style={{color:'#FFFFFF', padding: "2px", left: '6px'}} primary={name}></ListItemText> 
                            <Box sx={{ flexGrow: 1 }}/>
                        </Toolbar>
                    </AppBar>
                </Box>
            )
        }
    }
    if (obtainedContact){
        if (obtainedContact.length>0){
            name = obtainedContact[0].firstName+' '+obtainedContact[0].lastName;
            if (name.length>20){
                name = name.slice(0, 20)+ '...';
            }
            return (
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="static" style={{height: '60px'}}>
                        <Toolbar>
                            <ReturnButton i18n={props.i18n} t={props.t} language={props.language} languageSet={props.languageSet}/>
                            <Divider style={{paddingLeft:'0px' }} sx={{ height: 28, m: 0.5 }} orientation="vertical" /> 
                            <Avatar  id={props.index}   alt={obtainedContact[0].firstName+' '+obtainedContact[0].lastName} srcSet={obtainedContact[0].avatar} />
                            <ListItemText id={props.index} style={{color:'#FFFFFF', padding: "2px", left: '6px'}} primary={name}></ListItemText>
                            <Box sx={{ flexGrow: 1 }}/>
                        </Toolbar>
                    </AppBar>
                </Box>
            );
        }
    }
    
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" style={{height: '60px'}}>
                <Toolbar>
                    <ReturnButton i18n={props.i18n} t={props.t} language={props.language} languageSet={props.languageSet}/>
                    <Divider style={{paddingLeft:'0px' }} sx={{ height: 28, m: 0.5 }} orientation="vertical" /> 
                    <Box sx={{ flexGrow: 1 }}/>
                </Toolbar>
            </AppBar>
        </Box>
    );
}