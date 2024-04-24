import React, { useEffect, useState } from 'react';
import {
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Autocomplete, Box, Stack, Input
} from '@mui/material';
import axios from 'axios';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationPage from "@/pages/Notification";

import {useRouter} from "next/navigation";
import {useDispatch, useSelector} from "react-redux";
import {jwtDecode} from "jwt-decode";

import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Link from "next/link";

//This is the page that the user themself sees (able to edit and such)

function MyInfoPage() {
  const router = useRouter();

  const token = useSelector(state => state.authorization.token); //get current state
  const dispatch = useDispatch(); // use to change state

  const [user, setUser] = useState(null);
  // const [profile, setProfile] = useState(null);
  const [id, setId] = useState(null);
  const [bio, setBio] = useState('');
  const [pictureUrl, setPictureUrl] = useState('');
  const [username, setUsername] = useState(null);
  const [ratingScore, setRatingScore] = useState(0);
  const [userCourses, setUserCourses] = useState([]);
  const [coursesSelect, setCoursesSelect] = useState([]);
  const [courses, setCourses] = useState([]);
  const [school, setSchool] = useState(null);
  const [connectionCount, setConnectionCount] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [addCoursesOpen, setAddCoursesOpen] = useState(false);
  const [coursePrefix, setPrefix] = useState(null);
  const [courseNumber, setNumber] = useState(null);

  const api = axios.create({
    //baseURL: 'http://localhost:8080/',
    baseURL: 'http://34.16.169.60:8080/',
    // must add the header to associate requests with the authenticated user
    headers: {'Authorization': `Bearer ${token}`},
  });


  useEffect(() => {
    try{
      // only authorized users can do this (must have token)
      const decodedUser = jwtDecode(token);
      setUsername(decodedUser.sub);

      const fetchData = async () => {
        fetchUser(decodedUser.sub);
        //fetchProfile(decodedUser.sub);
        await fetchUserCourses(decodedUser.sub);
        fetchConnectionCount(decodedUser.sub);
        await fetchRatingsForMe(decodedUser.sub);
        await fetchAverageScore(decodedUser.sub);
      };

      fetchData();
    }
    catch(err) {
      router.push(`/error`);
    }
  }, []);

  const fetchUser = (user) => {
    console.log("User to fetch for: " + user);

    api.get(`me/${user}`)
      .then(data => {
        setUser(data.data);
        console.log(data.data);
        setSchool(data.data.school);
      })
      .catch(error => console.error('Error fetching user:', error));
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

  const getCourses = () => {
    api.get(`api/get-all-courses/${school.id}`)
        .then((res1) =>{
          setCourses(res1.data);
        })
  }

  const handleProfilePic = (pic) => {
    setPictureUrl(pic);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userInfo = {
      username: user.username,
      pictureUrl: pictureUrl,
      bio: bio
    };

    try {
      const res = await api.put("me", userInfo);
      if (res.status === 200) {
        handleSettingsClose();
        fetchUser(username);
      }
    } catch (err) {
      console.error("ERROR UPDATING PROFILE:", err);
    }
  };

  //SETTINGS
  const handleSettingsOpen = () => {
    setSettingsOpen(true);
    setId(user.id);
    setBio(user.bio);
    setPictureUrl(user.pictureUrl);
  };

  const handleSettingsClose = () => {
    setSettingsOpen(false);
  };

  //EDITING EXISTING COURSES
  const handleCoursesOpen = () => {
    getCourses();
    setCoursesSelect(userCourses);
    setCoursesOpen(true);
  };

  const handleCoursesClose = () => {
    setCoursesOpen(false);
  };

  const handleCoursesSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await api.post(`api/add-user-courses/${username}`, coursesSelect);
      if (res.status === 200) {
        handleCoursesClose();
        setUserCourses(res.data);
      }
    } catch (err) {
      console.error("ERROR UPDATING COURSES:", err);
    }
  };

  //ADDING NON-EXISTING COURSES

  const handleAddCoursesOpen = () => {
    setAddCoursesOpen(true);
  };

  const handleAddCoursesClose = () => {
    setAddCoursesOpen(false);
  };


  const handleAddCoursesSubmit = (event) => {
    event.preventDefault();
    console.log('before:'+userCourses);
    if (coursePrefix && courseNumber) {
      const course = {
        coursePrefix, courseNumber, school
      }
      console.log(course);
      api.post(`api/add-course`, course)
          .then((res) => {
            console.log("yay we did it! Added " + coursePrefix + " " + courseNumber);
            coursesSelect.push(res.data);
            getCourses();
            setAddCoursesOpen(false);
          })
          .catch((err) => {
            window.alert("aww didn't work for " + username + " " + coursePrefix + " " + courseNumber);
          })
    } else {
      window.alert("Please input a coursePrefix and a courseNumber");
    }

    console.log("after:"+userCourses);

  }


  const handleViewConnections = () =>{
    router.push(`/viewConnections`);
  }


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

        {user && (
            <Card sx={{width: 1200, margin: 'auto', marginTop: '125px', marginBottom: '10px', overflow: 'auto'}}
                  elevation={4}>
              <CardContent>
                <Grid container alignItems="center">
                  <Grid item sx={{marginLeft: '100px', marginTop: '40px'}}>
                    <Avatar sx={{ width: 100, height: 100, marginBottom: '15px' }} src={user.pictureUrl} />

                    <strong style={{fontSize:'20px'}}>{user.firstName} {user.lastName}</strong>
                    <div style={{ color: 'gray' }}>@{user.username}</div>
                    <br/>
                    <div className="hover-underline" style={{ marginRight: '10px'}}>
                        <Link href="/viewConnections">
                          <span className="hover-underline" onclick={handleViewConnections} style={{ fontWeight: 'bold', cursor: 'pointer'}}>
                            {connectionCount === 1 ? '1 ' : `${connectionCount} `}
                          </span>
                        </Link>

                        <Link href="/viewConnections">
                          <span onclick={handleViewConnections} style={{ color: 'blue', fontWeight: 'bold', cursor: 'pointer'}}>
                            {connectionCount === 1 ? 'connection' : 'connections'}
                          </span>
                        </Link>

                    </div>

                    <div style={{ marginRight: '10px'}}>
                        <Typography variant="body1" sx={{  fontStyle: 'italic', color: 'gray'}}>
                          {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
                        </Typography>
                    </div>

                  </Grid>

                  <Grid item sx={{ marginLeft: 'auto', marginRight: '100px', marginTop: '40px' }}>
                    <Button variant="contained" onClick={handleSettingsOpen} startIcon={<SettingsIcon />}>Settings</Button>
                  </Grid>
                </Grid>
                <br />

                <Typography variant="body1" style={{ marginLeft: '100px' }}>
                  {user.bio}
                </Typography>

                {user.userType === 'tutor' && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '50px' }}>
                      <Typography variant="body1" style={{ fontWeight: 'bold', marginRight: '10px', fontSize: '24px' }}>
                        Average Rating Score:
                      </Typography>
                      <Rating name="average-rating" value={ratingScore} precision={0.5} readOnly />
                    </div>
                )}

            {user.userType !== 'tutor' && (
              <>
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
              </>
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
                      <Button variant="contained" onClick={() => handleCoursesOpen()} startIcon={<MenuBookIcon />}>Edit Your Courses</Button>
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
            defaultValue={user?.bio || ''}
            onChange={(e) => setBio(e.target.value)}
          />
  
          <div>Profile Picture</div>
          <div style={{ display: 'flex' }}>
            <Avatar sx={{ width: 100, height: 100, marginBottom: '15px', marginRight: '10px', cursor: 'pointer',   border: pictureUrl === '/tree.jpg' ? '3px solid blue' : 'none'}} onClick={() => handleProfilePic('/tree.jpg')} src="/tree.jpg" />
            <Avatar sx={{ width: 100, height: 100, marginBottom: '15px', marginRight: '10px', cursor: 'pointer',  border: pictureUrl === '/space.jpg' ? '3px solid blue' : 'none'}} onClick={() => handleProfilePic('/space.jpg')} src="/space.jpg" />
            <Avatar sx={{ width: 100, height: 100, marginBottom: '15px', marginRight: '10px', cursor: 'pointer',  border: pictureUrl === '/laugh.png' ? '3px solid blue' : 'none'}} onClick={() => handleProfilePic('/laugh.png')} src="/laugh.png" />
            <Avatar sx={{ width: 100, height: 100, marginBottom: '15px', marginRight: '10px', cursor: 'pointer',  border: pictureUrl === '/devil.png' ? '3px solid blue' : 'none'}} onClick={() => handleProfilePic('/devil.png')} src="/devil.png" />
          </div>
        </DialogContent>
  
        <DialogActions>
          <Button onClick={handleSettingsClose}>Cancel</Button>
          <Button variant="contained" type="submit" onSubmit={handleSubmit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

        <Dialog  id="course-selection"
            open={coursesOpen}
            onClose={handleCoursesClose}
            component="form" validate="true" onSubmit={handleCoursesSubmit}
        >
          <DialogTitle>Courses</DialogTitle>
          <DialogContent>
            <Box sx={{width: 500}}>
            <DialogContentText>
              Edit your courses.
            </DialogContentText>

            <Autocomplete
                multiple
                id="tags-standard"
                options={courses}
                getOptionLabel={(option) => option.coursePrefix+" "+option.courseNumber}
                value={coursesSelect}
                isOptionEqualToValue={(option,value) => option.courseId === value.courseId}
                onChange={(e, params) => setCoursesSelect(params)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        label="Multiple values"
                        placeholder="Favorites"
                    />
                )}
            />
              <br/>
              <Stack direction="row" sx={{alignItems:"center"}}>
                <p>Not there?</p><Button variant="contained" onClick={() => handleAddCoursesOpen()}>+ Add Course</Button>
              </Stack>
            </Box>

          </DialogContent>

          <DialogActions>

            <Button onClick={handleCoursesClose}>Cancel</Button>
            <Button variant="contained" type="submit" onSubmit={handleCoursesSubmit} color="primary">Save</Button>
          </DialogActions>
        </Dialog>

        {/*adding courses not in system*/}
        <Dialog  id="course-adding"
                 open={addCoursesOpen}
                 onClose={handleAddCoursesClose}
                 component="form" validate="true" onSubmit={handleAddCoursesSubmit}
        >
          <DialogTitle>Add Course</DialogTitle>
          <DialogContent>
            <Box sx={{width: 500}}>
              <DialogContentText>
                Add your course.
              </DialogContentText>

              <Box  sx={{ margin: 5 }}
                    component="form" validate="true">
                <TextField id="course_prefix" onChange={(event) => setPrefix(event.target.value)} label="Course Prefix" sx={{ width:100 }}/>
                <br/>
                <Input id="course_number" onChange={(event) => {setNumber(parseInt(event.target.value,10))}} type = "number" label="Course Number" sx={{ width:100 }}/>
              </Box>
            </Box>

          </DialogContent>

          <DialogActions>
            <Button onClick={handleAddCoursesClose}>Cancel</Button>
            <Button variant="contained" type="submit" onClick={handleAddCoursesSubmit}>Create Course</Button>
          </DialogActions>
        </Dialog>
    </div>
  );
}

export default MyInfoPage;