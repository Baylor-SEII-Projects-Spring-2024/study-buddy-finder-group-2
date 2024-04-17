import React, { useEffect, useState } from 'react';
import { Button, Grid, Card, CardContent, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import axios from 'axios';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationPage from "@/pages/Notification";
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import {useRouter} from "next/router";
import Link from "next/link";

//This is the page that the user themself sees (able to edit and such)

//TODO: Display links

function MyInfoPage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [id, setId] = useState(null);
  const [bio, setBio] = useState('');
  const [pictureUrl, setPictureUrl] = useState('');
  const [username, setUsername] = useState(null);
  const [ratingScore, setRatingScore] = useState(0);
  const [userCourses, setUserCourses] = useState([]);
  const [connectionCount, setConnectionCount] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const router = useRouter();
  const api = axios.create({
    //baseURL: 'http://localhost:8080/'
    baseURL: 'http://34.16.169.60:8080/'
  });

  

  useEffect(() => {
    const params = new URLSearchParams(window.location.search),
      user = params.get("username");

    setUsername(user);

    const fetchData = async () => {
      await fetchUser(user);
      await fetchProfile(user);
      await fetchUserCourses(user);
        fetchConnectionCount(user);
      await fetchRatingsForMe(user);
      await fetchAverageScore(user);
    };

    fetchData();
  }, []);
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

    const fetchConnectionCount = (user) => {

      api.get(`/api/viewConnections/getConnectionCount/${user}`)
          .then(data =>{
              setConnectionCount(data.data)
              console.log(data.data);}
          )
          .catch(error => console.error(`Error fetching connection count`, error));
  };

  

  const fetchAverageScore = async (user) => {
    try {
      const res = await api.get(`averageRating/${user}`);
      setRatingScore(res.data);
      console.log("rating: "+res.data);
    } catch (error) {
      console.error('Error fetching average rating:', error);
    }
  };

  const fetchRatingsForMe = async (user) => {
    try {
      const res = await api.get(`viewRatingsForMe/${user}`);
      setRatings(res.data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const fetchUserCourses = async (user) => {
    try {
      const res = await api.get(`api/get-courses-user/${user}`);
      setUserCourses(res.data);
    } catch (error) {
      console.error(`Error fetching ${username}'s courses:`, error);
    }
  };

  const handleProfilePic = (pic) => {
    setPictureUrl(pic);
  }


  const handleSubmit = async (event) => {
    event.preventDefault();
    const profileData = {
      id,
      username,
      bio, pictureUrl
    };

    try {
      const res = await api.put("me", profileData);
      if (res.status === 200) {
        handleSettingsClose();
        fetchProfile(username);
      }
    } catch (err) {
      console.error("ERROR UPDATING PROFILE:", err);
    }
  };

  const handleSettingsOpen = () => {
    setSettingsOpen(true);
    setId(profile.id);
    setBio(profile.bio);
  };

  const handleSettingsClose = () => {
    setSettingsOpen(false);
  };

  const displayRatings = () => {
    return(
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '50px'}}>
      <Typography variant="body1" style={{fontWeight: 'bold', marginRight: '10px', fontSize: '24px'}}>
        Average Rating Score:
      </Typography>
      <Rating name="average-rating" value={ratingScore} precision={0.5} readOnly/>
    </div>);
  }

  return (
      <div>
        <NotificationPage></NotificationPage><br/>

        {user && profile && (
            <Card sx={{width: 1200, margin: 'auto', marginTop: '125px', marginBottom: '10px', overflow: 'auto'}}
                  elevation={4}>
              <CardContent>
                <Grid container alignItems="center">
                  <Grid item sx={{marginLeft: '100px', marginTop: '40px'}}>
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

              <Grid item sx={{ marginLeft: 'auto', marginRight: '100px', marginTop: '40px' }}>
                <Button variant="contained" onClick={handleSettingsOpen} startIcon={<SettingsIcon />}>Settings</Button>
              </Grid>
            </Grid>
            <br />

            <Typography variant="body1" style={{ marginLeft: '100px' }}>
              {profile.bio}
            </Typography>

            {user.userType === 'tutor' ? displayRatings() : console.log("no ratings to view")}

            {ratings.length > 0 ? (
              ratings.map((rating, index) => (
                <Card key={index} sx={{ width: 500, margin: 'auto', marginTop: 3, marginBottom: 3, height: 'auto' }} elevation={6}>
                  <CardContent>
                    <Typography variant='h5' align='center' sx={{ marginTop: '15px', fontWeight: 'bold' }}>
                      Rating from {rating.ratingUser.username}
                    </Typography>
                    <Typography variant='h6' align='center' sx={{ marginTop: '10px', fontWeight: 'normal' }}>
                      Meeting: {rating.meetingTitle}
                    </Typography>
                    <Typography variant='h6' align='center' sx={{ marginTop: '10px' }}>
                    <Rating name="rating_score" value={rating.score} precision={0.5} readOnly />
                    </Typography>
                    <Typography variant='body1' align='center' sx={{ marginTop: '10px' }}>
                      Review: {rating.review}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="body1" align="center">
                No ratings available.
              </Typography>
            )}
                <div>
            <Typography variant="body1" style={{ fontWeight: 'bold', marginLeft: '100px', marginTop: '50px' }}>
              Courses
            </Typography>
            {userCourses && userCourses.length > 0 ? (
              userCourses.map((course, index) => (
                <div key={index} style={{ marginLeft: '100px', color: 'gray' }}>
                  {course.coursePrefix} {course.courseNumber}
                </div>
              ))
            ) : (
              <Typography variant="body1" style={{ fontStyle: 'italic', marginLeft: '100px' }}>
                Not enrolled in any courses.
              </Typography>
            )}
                  <Grid item sx={{ marginLeft: '100px', marginRight: '100px', marginTop: '40px' }}>
                    <Link href={`/editCourse?username=${encodeURIComponent(username)}`} passHref>
                      <Button variant="contained" startIcon={<MenuBookIcon />}>Edit Your Courses</Button>
                    </Link>
                  </Grid>
                </div>
          </CardContent>
        </Card>
      )}

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