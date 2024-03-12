import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Stack, Typography, TextField} from '@mui/material';

//This is the page that the user themself sees (able to edit and such)

//TODO: Display username, name, courses, and a bio

function MyInfoPage() {
  const [editable, setEditable] = useState(false);
  const [text, setText] = useState('');
  const [editSave, setEditSave] = useState();

  const handleEdit = () =>{
    setEditable(!editable);
  }

  const handleText = (event) =>{
    setText(event.target.value);
  }

  return (
    <div>
      <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
        <Card sx={{ width: 300, margin: 'auto' }} elevation={4}>
          <CardContent>
            <Typography variant='h4' align='center'>My Profile</Typography>
          </CardContent>
        </ Card>

        <Card sx={{ width: 1400, margin: 'auto' }} elevation={4}>
          <CardContent>
            {/* Name and username */}
            <strong style={{marginLeft: '100px'}}>Cameron Armijo</strong>
            <div style={{marginLeft: '100px', color: 'gray'}}>@Cam</div>
            <br />

            {/* BIO */}
            {editable ? (
              <div>
                <TextField
                  multiline
                  rows={2}
                  sx={{ width: '500px' }}
                  style={{marginLeft: '100px'}}
                  value={text}
                  onChange={handleText}
                />
                <Button onClick={handleEdit}>Save</Button>
              </div>
            ) : (
              <div>
                <div style={{marginLeft: '100px'}}>{text}</div>
                <Button style={{marginLeft: '100px'}} onClick={handleEdit}>Edit</Button>
              </div>
            )}
          </CardContent>
        </ Card>
      </Stack>

    </div>
  );
}

export default MyInfoPage;
