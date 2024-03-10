import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Stack, Typography, TextField} from '@mui/material';

//This is the page that the user themself sees (able to edit and such)

//TODO: Display username, name, courses, and a bio

function MyInfoPage() {
  const [editable, setEditable] = useState(false);
  const [text, setText] = useState('');
  const [editSave, setEditSave] = useState();
  const [username, setUsername] = useState(null);
  const [user, setUser] = useState(null);

  const fetchUser = (user) => {
    console.log("User to fetch for: " + user);

    fetch(`http://localhost:8080/me/${user}`) // use this for local development
    //fetch(`http://34.16.169.60:8080/viewMeetups/${user}`)
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error('Error fetching user:', error));
  };

  useEffect(() => {
        const params = new URLSearchParams(window.location.search),
        user = params.get("username");

        setUsername(user);

        fetchUser(user);
    }, []);

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

        {user ? (
        <Card sx={{ width: 1400, margin: 'auto' }} elevation={4}>
          <CardContent>
            {/* Name and username */}
            <strong style={{marginLeft: '100px'}}>{user.firstName} {user.lastName}</strong>
            <div style={{marginLeft: '100px', color: 'gray'}}>@{user.username}</div>
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

           ) : null }
      </Stack>

    </div>
  );
}

export default MyInfoPage;
