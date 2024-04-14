import React, { useEffect, useState } from 'react';
import { Button, Grid, Card, CardContent, Stack, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from '@mui/material';
import axios from 'axios';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationPage from "@/pages/Notification";
import Avatar from '@mui/material/Avatar';

//This is the page that the user themself sees (able to edit and such)

//TODO: Display links

function MyInfoPage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [id, setId] = useState(null);
  const [bio, setBio] = useState('');
  const [pictureUrl, setPictureUrl] = useState('');
  const [username, setUsername] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [userCourses, setUserCourses] = useState([]);
  const [connectionCount, setConnectionCount] = useState(0);

  const api = axios.create({
    //baseURL: 'http://localhost:8080/'
    baseURL: 'http://34.16.169.60:8080/'
  });

  const fetchUser = (user) => {
    console.log("User to fetch for: " + user);

    api.get(`me/${user}`)
      .then(data => setUser(data.data))
      .catch(error => console.error('Error fetching user:', error));
  };

  const fetchProfile = (user) => {
    console.log("Profile to fetch for: " + user);

    api.get(`profile/${user}`)
      .then(data => setProfile(data.data))
      .catch(error => console.error('Error fetching profile:', error));
  };

  useEffect(() => {
        const params = new URLSearchParams(window.location.search),
        user = params.get("username");

        setUsername(user);

        fetchUser(user);
        fetchProfile(user);
        fetchUserCourses(user);
        fetchConnectionCount(user);
    }, []);

    const fetchConnectionCount = (user) => {

      api.get(`/api/viewConnections/getConnectionCount/${user}`)
          .then(data =>{
              setConnectionCount(data.data)
              console.log(data.data);}
          )
          .catch(error => console.error(`Error fetching connection count`, error));
  };

  const fetchUserCourses = (user) => {

      api.get(`api/get-courses-user/${user}`)
          .then(data =>{
              setUserCourses(data.data)
              console.log(data.data);}
          )
          .catch(error => console.error(`Error fetching ${username}'s courses:`, error));
  };

  const handleProfilePic = (pic) => {
    setPictureUrl(pic);
  }


  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const profile = {
      id, username, bio, pictureUrl
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
        <NotificationPage></NotificationPage><br/>

      {user && profile ? (
        <Card sx={{ width: 1200, margin: 'auto', height: 'auto', marginTop: '50px', marginBottom: '10px'}} elevation={4}>
          <CardContent>

            {/* Name and username */}
            <Grid container alignItems="center">
              <Grid item sx={{ marginLeft: '100px', marginTop: '40px'}}>
                <Avatar sx={{ width: 100, height: 100, marginBottom: '15px' }} src={profile.pictureUrl} />

                <strong style={{fontSize:'20px'}}>{user.firstName} {user.lastName}</strong>
                <div style={{ color: 'gray' }}>@{user.username}</div>
                <br/>
                <div style={{ marginRight: '10px'}}>
                  <span style={{ fontWeight: 'bold' }}>
                    {connectionCount === 1 ? '1 ' : `${connectionCount} `}
                  </span>
                  <span style={{ color: 'blue', fontWeight: 'bold' }}>
                    {connectionCount === 1 ? 'connection' : 'connections'}
                  </span>
                </div>




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

          <div>Profile Picture</div>
          <div style={{ display: 'flex' }}>
            <Avatar sx={{ width: 100, height: 100, marginBottom: '15px', marginRight: '10px', cursor: 'pointer'}} onClick={() => handleProfilePic('/tree.jpg')} src="/tree.jpg" />
            <Avatar sx={{ width: 100, height: 100, marginBottom: '15px', marginRight: '10px', cursor: 'pointer'}} onClick={() => handleProfilePic('/space.jpg')} src="/space.jpg" />
            <Avatar sx={{ width: 100, height: 100, marginBottom: '15px', marginRight: '10px', cursor: 'pointer'}} onClick={() => handleProfilePic('/laugh.png')} src="/laugh.png" />
            <Avatar sx={{ width: 100, height: 100, marginBottom: '15px', marginRight: '10px', cursor: 'pointer'}} onClick={() => handleProfilePic('/devil.jpg')} src="/devil.jpg" />
          </div>

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
