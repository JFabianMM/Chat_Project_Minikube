import React from 'react';
import { useSelector } from 'react-redux';

export function StandardImage(props) {
  const file = useSelector(state => state.file);
  const avatar = useSelector(state => state.avatar);

  let preview; 
  if (file!= {}){
     preview=file;
  }else{
    preview=avatar
  }

  return (
    <div style={{padding: "10px"}}>
      {itemData.map((item) => (
          <img key={1}
            srcSet={`${preview}`}
            alt={props.t('menu.bar.picture.profile')}
            loading="lazy"
            height="200"
            width="200"
          />
      ))}
    </div>
  );
}

const itemData = [
  {
    title: 'Profile Picture',
   }
];