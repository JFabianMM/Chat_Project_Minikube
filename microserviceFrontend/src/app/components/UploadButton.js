import React, {useState} from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { updateFile } from '../../redux/slice/fileSlice';
import {useDispatch} from 'react-redux';

export function UploadButton(props) {
  let array= ['1'];
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [fileName, setFileName] = useState('');

  const Dispatch = useDispatch();

  const changeHandler = (event) => {
      event.preventDefault();
    	setSelectedFile(event.target.files[0]);
    	setIsFilePicked(true);
      setFileName(event.target.files[0].name);
      const file2 = event.target.files[0];
      const reader = new FileReader();
      
      reader.addEventListener(
        "load",
        () => {
          Dispatch(updateFile(reader.result));
        },
        false
      ); 
      if (file2) {
        reader.readAsDataURL(file2);
      }
  };

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <div style={{padding: "10px"}}>
        <Button variant="contained" component="label">
          {props.t('menu.profile.upload')}
          <input hidden accept="image/*" multiple type="file" onChange={changeHandler} />
        </Button>
      </div>
          {
              array.map((element) =>{
                  if (isFilePicked==true) {
                      return (
                          <Typography key={element.indexOf}>
                            {fileName}
                          </Typography>
                      );
                  }
              })
          }                         
    </Stack>
  );
}