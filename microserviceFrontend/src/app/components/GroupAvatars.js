import React from 'react';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';

export function GroupAvatars(props) {
  return (
    <AvatarGroup max={5}>
      {
              props.group.members.map((element) =>{
                  return (
                      <Avatar key={element.id} alt={element.firstName} srcSet={element.avatar} />
                  );
              })
      }
    </AvatarGroup>
  );
}