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
  Autocomplete, Box, Stack, Input, LinearProgress, Snackbar
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
import Head from "next/head";
import {createTheme} from "@mui/material/styles";
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
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [addCoursesOpen, setAddCoursesOpen] = useState(false);
  const [coursePrefix, setPrefix] = useState(null);
  const [courseNumber, setNumber] = useState(null);
  const [password, setPassword] = useState("");
  const [oldPwd, setOldpwd] = useState("");
  const [errCPwd, setErrCPwd] = useState("");
  const [errPwd, setErrPwd] = useState("");
  const [errOldPwd, setErrOldPwd] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [borderStyle, setBorderStyle] = useState('3px solid #A9A9A9; border-radius: 20px;');
  const [isPasswordEntered, setIsPasswordEntered] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const theme = createTheme({
    palette: {
      primary: {
        main: '#4caf50',
      },
      secondary: {
        main: '#ffeb3b',
      },
      error: {
        main: '#f44336',
      },
    },
  });

  const api = axios.create({
    baseURL: 'http://localhost:8080/',
    //baseURL: 'http://34.16.169.60:8080/',
    // must add the header to associate requests with the authenticated user
    headers: {'Authorization': `Bearer ${token}`},
  });

  useEffect(() => {
    if (passwordStrengthColors[passwordStrength]) {
      setBorderStyle(`3px solid transparent; border-image: ${passwordStrengthColors[passwordStrength]} 1 stretch; border-radius: 20px;`);
    }
  }, [passwordStrength]);

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

  //HANDLING CONNECTIONS

  const handleViewConnections = () =>{
    router.push(`/viewConnections`);
  }





  //HANDLING RESET PASSWORD
  const handleResetPwdOpen = () => {
    setPasswordOpen(true);
  };

  const handleResetPwdClose = () => {
    setPasswordOpen(false);
  };

  const handlePasswordChange = (event) => {
    event.preventDefault();
    if (password === '' || confirmPassword === '' || oldPwd === '') {
      setSnackbarMessage("Please fill out all fields");
      setIsError(true);
      setSnackbarOpen(true);
      return;
    }
    if (errPwd !== "") {
      setSnackbarMessage(errPwd);
      setIsError(true);
      setSnackbarOpen(true);
      return;
    }

    if (errCPwd !== "") {
      setSnackbarMessage(errCPwd);
      setIsError(true);
      setSnackbarOpen(true);
      return;
    }

    api.get(`api/authorization/is-password/${username}/${oldPwd}`)
        .then((res) => {
          api.post(`api/authorization/change-password/${username}/${password}`)
              .then((e) => {
                setSnackbarMessage("Password successfully changed!");
                setIsError(false);
                setSnackbarOpen(true);
                handleResetPwdClose();
              })
              .catch((err) => {
                setSnackbarMessage("Password cannot be changed at this time!");
                setIsError(true);
                setSnackbarOpen(true);
              })
        })
        .catch((er) => {
          setErrOldPwd("Old password does not match actual password");
          setSnackbarMessage("The old password is not correct!");
          setIsError(true);
          setSnackbarOpen(true);
        });

  };

  const handleChangePassword = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    if (newPassword === '') {
      setIsPasswordEntered(false);
    } else {
      setIsPasswordEntered(true);
    }
    const strength = evaluatePasswordStrength(newPassword);
    setPasswordStrength(strength);
    if (strength < 3) {
      setErrPwd("Password is too weak. Strong passwords contain at least 8 characters, 1 capital letter, 1 number, and 1 special character (@.#$!%*?&^)");
    } else {
      setErrPwd("");
    }
  };

  const handleChangeConfirmPassword = (event) => {
    const newPassword = event.target.value;
    setConfirmPassword(newPassword);
    if ( newPassword !== password ) {
      setErrCPwd("Passwords do not match");
    } else {
      setErrCPwd("");
    }
  };

  const handleOldPassword = (event) => {
    const oldPassword = event.target.value;
    setOldpwd(oldPassword);
  }

  const evaluatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return Math.min(strength, 4);
  };

  const passwordStrengthColors = {
    0: 'linear-gradient(to right, #ffcccc, #ff6666)',
    1: 'linear-gradient(to right, #ff6666, #ffcc66)',
    2: 'linear-gradient(to right, #ffcc66, #ccff66)',
    3: 'linear-gradient(to right, #ccff66, #66cc66)',
    4: 'linear-gradient(to right, #66cc66, #006400)'
  };

  const getColor = (strength) => {
    if (strength < 2) return 'error';
    if (strength < 3) return 'warning';
    if (strength < 4) return 'info';
    return 'success';
  };

  const colorByStrength = (strength) => {
    switch (strength) {
      case 1:
        return ['#ffcccc', '#ff6666', '#ff4d4d'];
      case 2:
        return ['#ffeb99', '#ffcc66', '#ffbf00'];
      case 3:
        return ['#d9f2d9', '#ccff66', '#b3ff66'];
      case 4:
        return ['#66cc66', '#33cc33', '#009900'];
      default:
        return ["#006400", "#2F4F4F", "#228B22", "#B8860B", "#DAA520", "#FFD700"];
    }
  };


  return (
      <div>
        <Head>
          <title>My Profile</title>
        </Head>
        <NotificationPage></NotificationPage><br/>

        {user && (
            <Card sx={{width: 1200, margin: 'auto', marginTop: '10px', marginBottom: '10px', overflow: 'auto', border: '3px solid black'}}
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
                            {connectionCount === 1 ? 'buddy' : 'buddies'}
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
                    <Button variant="contained" onClick={handleResetPwdOpen} >Reset Password</Button>
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

                {user.userType === 'tutor' && (
                    <div>
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
                    </div>
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
                      user.userType === 'student' ? (
                            <Typography variant="body1" style={{ fontStyle: 'italic', marginLeft: '100px' }}>
                              Not enrolled in any courses.
                            </Typography>
                          ) :
                          (
                            <Typography variant="body1" style={{ fontStyle: 'italic', marginLeft: '100px' }}>
                              Not teaching any courses.
                            </Typography>
                          )

                  )}
                  <Grid item sx={{ marginLeft: '80px', marginRight: '100px', marginTop: '40px' }}>
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

            <div style={{ marginTop: '15px', marginBottom: '10px', color: 'gray', fontSize: '15px'}}>Profile Picture</div>
            <div style={{ display: 'flex'}}>
              <Avatar sx={{ width: 100, height: 100, marginBottom: '15px', marginRight: '10px', cursor: 'pointer',   border: pictureUrl === '/tree.jpg' ? '3px solid #42f5e9' : 'none'}} onClick={() => handleProfilePic('/tree.jpg')} src="/tree.jpg" />
              <Avatar sx={{ width: 100, height: 100, marginBottom: '15px', marginRight: '10px', cursor: 'pointer',  border: pictureUrl === '/space.jpg' ? '3px solid #42f5e9' : 'none'}} onClick={() => handleProfilePic('/space.jpg')} src="/space.jpg" />
              <Avatar sx={{ width: 100, height: 100, marginBottom: '15px', marginRight: '10px', cursor: 'pointer',  border: pictureUrl === '/laugh.png' ? '3px solid #42f5e9' : 'none'}} onClick={() => handleProfilePic('/laugh.png')} src="/laugh.png" />
              <Avatar sx={{ width: 100, height: 100, marginBottom: '15px', marginRight: '10px', cursor: 'pointer',  border: pictureUrl === '/devil.png' ? '3px solid #42f5e9' : 'none'}} onClick={() => handleProfilePic('/devil.png')} src="/devil.png" />
              <Avatar sx={{ width: 100, height: 100, marginBottom: '15px', marginRight: '10px', cursor: 'pointer',  border: pictureUrl === '/penguin.jpg' ? '3px solid #42f5e9' : 'none'}} onClick={() => handleProfilePic('/penguin.jpg')} src="/penguin.jpg" />
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
                <TextField id="course_prefix" onChange={(event) => setPrefix(event.target.value.toUpperCase())} label="Course Prefix" sx={{ width:100 }}/>
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

        <Dialog  id="course-adding"
                 open={addCoursesOpen}
                 onClose={handleAddCoursesClose}
                 component="form" validate="true" onSubmit={(event) => handleAddCoursesSubmit(event)}
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

        <Dialog  id="reset-password"
                 open={passwordOpen}
                 onClose={handleResetPwdClose}
                 component="form" validate="true" onSubmit={handlePasswordChange}
        >
          <DialogTitle>Reset Password</DialogTitle>
          <DialogContent>
            <Box sx={{width: 500}}>

              <Box  sx={{ margin: 5 }}
                    component="form" validate="true">
                <TextField id="pwd-old"
                           type={"password"}
                           error={errOldPwd !== ""}
                           onChange={(event) => handleOldPassword(event)}
                           label="Old Password"
                           sx={{ width:300 }}/>
                <br/> <br/>
                <DialogContentText>
                  Enter your new password:
                </DialogContentText>
                <br/>
                {password && (
                    <Box sx={{ width: '100%', mb: 2, transition: 'width 0.5s ease-in-out' }}>
                      <LinearProgress
                          variant="determinate"
                          value={(passwordStrength / 4) * 100}
                          color={getColor(passwordStrength)}
                          sx={{ width: '100%', height: 10 }}
                      />
                      <Typography sx={{ textAlign: 'center', mt: 1 }}>
                        Password Strength: {['Weak', 'Fair', 'Good', 'Strong'][passwordStrength - 1]}
                      </Typography>
                    </Box>
                )}
                <TextField id="pwd-new"
                           error={errPwd !== ""}
                           type={"password"}
                           onChange={(event) => handleChangePassword(event)}
                           label="New Password"
                           sx={{ width:300 }}/>
                <br/> <br/>
                <TextField id="pwd-confirm"
                           type={"password"}
                           error={errCPwd !== ""}
                           onChange={(event) => handleChangeConfirmPassword(event)}
                           label="Confirm New Password"
                           sx={{ width:300 }}/>
                <br/>
              </Box>
            </Box>

          </DialogContent>

          <DialogActions>
            <Button onClick={handleResetPwdClose}>Cancel</Button>
            <Button variant="contained" type="submit" onClick={(event) => handlePasswordChange(event)}>Change Password</Button>
          </DialogActions>
        </Dialog>
        <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            message={snackbarMessage}
            sx={{
              '& .MuiSnackbarContent-root': {
                backgroundColor: isError ? theme.palette.error.main : theme.palette.primary.main,
              },
            }}
        />
      </div>
  );
}

export default MyInfoPage;