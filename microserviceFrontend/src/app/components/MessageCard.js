import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';

export function MessageCard(props){
let a=[0];    
        return (
            <ListItem>
                <Grid container>
                    <Grid item xs={12}>
                        <ListItemText align={props.element.position} primary={props.element.message}></ListItemText>
                    </Grid>
                    <Grid item xs={12}>
                    {a.map((el, index) =>{
                            if (props.element.position=='left'){
                                return <ListItemText key={index} align={props.element.position} secondary={props.element.firstName + ' ' + props.element.lastName + ',   ' + props.element.time}></ListItemText>;
                            }else{
                                return <ListItemText key={index} align={props.element.position} secondary={props.element.time}></ListItemText>;
                                }})}
                    </Grid>
                </Grid>
            </ListItem>
        )
       
  }