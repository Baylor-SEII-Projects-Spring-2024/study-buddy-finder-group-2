import React, { useEffect, useState } from 'react';
import { Button, Grid, Card, CardContent, Stack, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from '@mui/material';

//This is the page that the user themself sees (able to edit and such)

//TODO: Display username, name, courses, links, and a bio
//TODO: Add a settings panel (dialog)
//TODO: Use userID instead of username

function MyInfoPage() {
  const [text, setText] = useState('');
  const [realText, setRealText] = useState('');
  const [username, setUsername] = useState(null);
  const [user, setUser] = useState(null);

  const fetchUser = (user) => {
    console.log("User to fetch for: " + user);

    //fetch(`http://localhost:8080/me/${user}`) // use this for local development
    fetch(`http://34.16.169.60:8080/viewMeetups/${user}`)
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

  const handleText = (event) =>{
    //event.preventDefault();
    //handleSettingsClose();
    setText(event.target.value);
    console.log("BIO TEXT: " + event.target.value);
  }

  const handleSubmit = () =>{
    event.preventDefault();
    setRealText(text);

    handleSettingsClose();
  }

  //DIALOG (Settings)
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  const handleSettingsOpen = () => {
      setSettingsOpen(true);
  };

  const handleSettingsClose = () => {
      setSettingsOpen(false);
      setText(realText);
  };

  return (
    <div>
      <Stack sx={{ paddingTop: 4 , paddingBottom: 4}} alignItems='center' gap={2}>
        <Card sx={{ width: 300, margin: 'auto' }} elevation={4}>
          <CardContent>
            <Typography variant='h4' align='center'>My Profile</Typography>
          </CardContent>
        </ Card>
      </Stack>

      {user ? (
        <Card sx={{ width: 1200, margin: 'auto', height: 400, marginBottom: '10px'}} elevation={4}>
          <CardContent>
            {/* Name and username */}
            <Grid container alignItems="center">
              <Grid item sx={{ marginLeft: '100px', marginTop: '40px'}}>
                <strong style={{fontSize:'20px'}}>{user.firstName} {user.lastName}</strong>
                <div style={{ color: 'gray' }}>@{user.username}</div>
              </Grid>

              <Grid item sx={{ marginLeft: 'auto', marginRight: '100px', marginTop: '40px'}}>
                <Button variant='contained' color="primary" onClick={handleSettingsOpen}>Edit Profile</Button>
              </Grid>
            </Grid>
            <br />

            <Typography variant="body1" style={{ marginLeft: '100px'}}>
              {realText}
            </Typography>
          </CardContent>
        </Card>

      ) : null}






      {/*CREATE SETTINGS DIALOG BOX*/}
            <Dialog
                open={settingsOpen}
                onClose={handleSettingsClose}
                component="form" validate="true" onSubmit={handleSubmit}
            >

        <DialogTitle>Profile Settings</DialogTitle>
        <DialogContent>

          <DialogContentText>
            Edit your profile.
          </DialogContentText>

          <TextField
            autoFocus
            margin="dense"
            id="bio"
            name="bio"
            label="Bio"
            type="string"
            fullWidth
            variant="standard"
            defaultValue={realText}
            onChange={(e) => setText(e.target.value)}
          />

        </DialogContent>

        <DialogActions>
            <Button onClick={handleSettingsClose}>Cancel</Button>
            <Button variant="contained" type="submit" onSubmit={handleSubmit} color="primary">Save</Button>
        </DialogActions>
        
        </Dialog>

    </div>
  );
}

export default MyInfoPage;
