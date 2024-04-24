import React, { useEffect, useState } from 'react';
import { Button, Grid, Card, CardContent, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import axios from 'axios';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationPage from "@/pages/Notification";
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import {useRouter} from "next/navigation";
import {useDispatch, useSelector} from "react-redux";
import {jwtDecode} from "jwt-decode";

//This is the page that the user themself sees (able to edit and such)

//TODO: Display links

function OthersInfoPage() {
  const router = useRouter();
  const otherUser = router.query;
  const token = useSelector(state => state.authorization.token); //get current state
  const dispatch = useDispatch(); // use to change state

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState(null);
  const [ratingScore, setRatingScore] = useState(0);
  const [userCourses, setUserCourses] = useState([]);
  const [connectionCount, setConnectionCount] = useState(0);
  const [ratings, setRatings] = useState([]);
  const api = axios.create({
    baseURL: 'http://localhost:8080/',
    //baseURL: 'http://34.16.169.60:8080/',
    headers: {'Authorization': `Bearer ${token}`},
  });
  useEffect(() => {
    try{
      // only authorized users can do this (must have token)
      const decodedUser = jwtDecode(token);
      setUsername(decodedUser.sub);

      api.get(`users/${username}`)
      .then((res) => {
          setUser(res.data);
          console.log(res.data);
          const fetchData = async () => {
              fetchUser(username);
              fetchProfile(username);
              await fetchUserCourses(username);
              fetchConnectionCount(username);
              await fetchRatingsForMe(username);
              await fetchAverageScore(username);
          };

          

          handleSetConnection();

          fetchData();
      });

}
catch(err) {
  router.push(`/error`);
}
  }, []);

  const fetchUser = (otherUser) => {
    console.log("User to fetch for: " + otherUser);

    api.get(`me/${otherUser}`)
      .then(data => setUser(data.data))
      .catch(error => console.error('Error fetching user:', error));
  };

  const fetchProfile = (otherUser) => {
    console.log("Profile to fetch for: " + user);

    api.get(`profile/${otherUser}`)
      .then(data => setProfile(data.data))
      .catch(error => console.error('Error fetching profile:', error));
  };

    const fetchConnectionCount = (otherUser) => {

      api.get(`/api/viewConnections/getConnectionCount/${otherUser}`)
          .then(data =>{
              setConnectionCount(data.data)
              console.log(data.data);}
          )
          .catch(error => console.error(`Error fetching connection count`, error));
  };

  

  const fetchAverageScore = async (otherUser) => {
    try {
      const res = await api.get(`averageRating/${otherUser}`);
      setRatingScore(res.data);
    } catch (error) {
      console.error('Error fetching average rating:', error);
    }
  };

  const fetchRatingsForMe = async (otherUser) => {
    try {
      const res = await api.get(`viewRatingsForMe/${otherUser}`);
      setRatings(res.data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const fetchUserCourses = async (otherUser) => {
    try {
      const res = await api.get(`api/get-courses-user/${otherUser}`);
      setUserCourses(res.data);
    } catch (error) {
      console.error(`Error fetching ${otherUser}'s courses:`, error);
    }
  };

  const handleProfilePic = (pic) => {
    setPictureUrl(pic);
  }


  

  return (
    <div>
      <NotificationPage></NotificationPage><br/>

      {user && profile && (
        <Card sx={{ width: 1200, margin: 'auto', marginTop: '10px', marginBottom: '10px', overflow: 'auto' }} elevation={4}>
          <CardContent>
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
            </Grid>
            <br />

            <Typography variant="body1" style={{ marginLeft: '100px' }}>
              {profile.bio}
            </Typography>
            {user.userType === 'tutor' && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '50px' }}>
              <Typography variant="body1" style={{ fontWeight: 'bold', marginRight: '10px', fontSize: '24px' }}>
                Average Rating Score:
              </Typography>
              <Rating name="average-rating" value={ratingScore} precision={0.5} readOnly />
            </div>
            )}
            {ratings.length > 0 && user.userType === 'tutor' ? (
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default OthersInfoPage;
