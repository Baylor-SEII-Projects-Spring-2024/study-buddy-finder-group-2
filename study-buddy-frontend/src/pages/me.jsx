import React, { useEffect, useState } from 'react';
import { Button, Grid, Card, CardContent, Stack, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from '@mui/material';
import axios from 'axios';
import SettingsIcon from '@mui/icons-material/Settings';

//This is the page that the user themself sees (able to edit and such)

//TODO: Display profile pictures, links

function MyInfoPage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [id, setId] = useState(null);
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [userCourses, setUserCourses] = useState([]);

  const api = axios.create({
    //baseURL: 'http://localhost:8080/'
    baseURL: 'http://34.16.169.60:8080/'
  });

  const fetchUser = (user) => {
    console.log("User to fetch for: " + user);

    api.get(`me/${user}`)
      .then(response => response.data)
      .then(data => setUser(data))
      .catch(error => console.error('Error fetching user:', error));
  };

  const fetchProfile = (user) => {
    console.log("Profile to fetch for: " + user);

    api.get(`profile/${user}`)
      .then(response => response.data)
      .then(data => setProfile(data))
      .catch(error => console.error('Error fetching profile:', error));
  };

  useEffect(() => {
        const params = new URLSearchParams(window.location.search),
        user = params.get("username");

        setUsername(user);

        fetchUser(user);
        fetchProfile(user);
        fetchUserCourses(user);
    }, []);

  const fetchUserCourses = (user) => {
      api.get(`api/get-courses-user/${user}`)
          .then(response => response.data)
          .then(data =>{
              setUserCourses(Array.from(data))
              console.log(data);}
          )
          .catch(error => console.error(`Error fetching ${username}'s courses:`, error));
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const profile = {
      id, username, bio
    }
  
    api.put("me", profile)
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

            <Typography variant="body1" style={{ fontWeight: 'bold', marginLeft: '100px', marginTop: '50px'}}>
              Courses
            </Typography>

            {userCourses && userCourses.length > 0 ? (
              userCourses.map((course, index) => (
                <div key={index} style={{ marginLeft: '100px', color: 'gray'}}>
                  {course.coursePrefix} {course.courseNumber}
                </div>
              )))
            : (
              <Typography variant="body1" style={{ fontStyle: 'italic', marginLeft: '100px'}}>
                Not enrolled in any courses.
              </Typography>
            )}
          </CardContent>
        </Card>

      ) : null}


      {/* SETTINGS DIALOG BOX */}
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
