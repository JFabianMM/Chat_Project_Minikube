import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux';

export function MessageCard(props){
    const userData = useSelector(state => state.userData);

    if (props.element.origin!=userData._id){     
        return (
            <ListItem>
                <Grid container>
                    <Grid item xs={12}>
                        <ListItemText className="textItem" align={'left'} primary={props.element.message}></ListItemText>
                    </Grid>
                    <Grid item xs={12}>
                        <ListItemText align={'left'} secondary={props.element.firstName + ' ' + props.element.lastName + ',   ' + props.element.time}></ListItemText>
                    </Grid>
                </Grid>
               
            </ListItem>
        )
    }else{
        return (
            <ListItem>
                <Grid container>
                    <Grid item xs={12}>
                        <ListItemText className="textItem" align={'right'} primary={props.element.message}></ListItemText>
                    </Grid>
                    <Grid item xs={12}>
                        <ListItemText align={'right'} secondary={props.element.time}></ListItemText>
                    </Grid>
                </Grid>
            </ListItem>
        )
    }
  }