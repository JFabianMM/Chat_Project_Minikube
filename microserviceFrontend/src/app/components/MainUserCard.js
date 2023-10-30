import React from 'react';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useSelector } from 'react-redux';

export function MainUserCard(props){
    const avatar = useSelector(state => state.avatar);

    let name = props.name;
    if (name.length>20){
        name = name.slice(0, 20)+ ' ...';
    }

    return (
            <ListItem style={{allign:'center'}} id={props.index} >
                <ListItemIcon>
                    <Avatar id={props.index} alt={name} srcSet={avatar} />
                </ListItemIcon>
                <ListItemText id={props.index} style={{color:'#FFFFFF'}} primary={name}></ListItemText>
                <ListItemText id={props.index} style={{color:'#FFFFFF'}} align="right"></ListItemText>
            </ListItem>
    )   
  }