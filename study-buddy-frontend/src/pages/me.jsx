import React, { useEffect, useState } from 'react';
import { Button, Grid, Card, CardContent, Stack, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from '@mui/material';
import axios from 'axios';
import SettingsIcon from '@mui/icons-material/Settings';

//This is the page that the user themself sees (able to edit and such)

//TODO: Display courses, links

function MyInfoPage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [id, setId] = useState(null);
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  const fetchUser = (user) => {
    console.log("User to fetch for: " + user);

    //fetch(`http://localhost:8080/me/${user}`) // use this for local development
    fetch(`http://34.16.169.60:8080/me/${user}`)
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error('Error fetching user:', error));
  };

  const fetchProfile = (user) => {
    console.log("Profile to fetch for: " + user);

    //fetch(`http://localhost:8080/profile/${user}`) // use this for local development
    fetch(`http://34.16.169.60:8080/profile/${user}`)
      .then(response => response.json())
      .then(data => setProfile(data))
      .catch(error => console.error('Error fetching profile:', error));
  };

  useEffect(() => {
        const params = new URLSearchParams(window.location.search),
        user = params.get("username");

        setUsername(user);

        fetchUser(user);
        fetchProfile(user);
    }, []);


  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const profile = {
      id, username, bio
    }
  
    //axios.put("http://localhost:8080/me", profile)
    axios.put("http://34.16.169.60:8080/me", profile)
      .then((res) => {
        if (res.status === 200) {
          handleSettingsClose();
          fetchProfile(username);
        }
      })
      .catch((err) => {
        console.log("ERROR UPDATING PROFILE.");
        console.log(err);
      });
  }
  


  //DIALOG (Settings)
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  const handleSettingsOpen = () => {
      setSettingsOpen(true);
      setId(profile.id);
      setBio(profile.bio);
      setProfilePic(profile.profilePic);
  };

  const handleSettingsClose = () => {
      setSettingsOpen(false);
  };
  

  return (
    <div>

      {user && profile ? (
        <Card sx={{ width: 1200, margin: 'auto', height: 400, marginTop: '125px', marginBottom: '10px'}} elevation={4}>
          <CardContent>

            {/* Name and username */}
            <Grid container alignItems="center">
              <Grid item sx={{ marginLeft: '100px', marginTop: '40px'}}>
                <strong style={{fontSize:'20px'}}>{user.firstName} {user.lastName}</strong>
                <div style={{ color: 'gray' }}>@{user.username}</div>
              </Grid>

              <Grid item sx={{ marginLeft: 'auto', marginRight: '100px', marginTop: '40px'}}>
                {/* <Button variant='contained' color="primary" onClick={handleSettingsOpen}>Edit Profile</Button> */}
                <Button variant="contained" onClick={handleSettingsOpen} startIcon={<SettingsIcon />}>Settings</Button>
              </Grid>
            </Grid>
            <br />

            <Typography variant="body1" style={{ marginLeft: '100px'}}>
              {profile.bio}
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
            defaultValue={profile?.bio || ''}
            onChange={(e) => setBio(e.target.value)}
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
