import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useSelector } from 'react-redux';

export function MainUserCard(props){
    const avatar = useSelector(state => state.avatar);
    return (
            <ListItem style={{allign:'center'}} id={props.index} >
                <ListItemIcon>
                    <Avatar id={props.index} alt={props.name} srcSet={avatar} />
                </ListItemIcon>
                <ListItemText id={props.index} style={{color:'#FFFFFF'}} primary={props.name}></ListItemText>
                <ListItemText id={props.index} style={{color:'#FFFFFF'}} align="right"></ListItemText>
            </ListItem>
    )   
  }