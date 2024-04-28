import React, { useEffect, useState } from 'react';
import { Button, Grid, Card, CardContent, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import axios from 'axios';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationPage from "@/pages/Notification";
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {jwtDecode} from "jwt-decode";
import Head from "next/head";
import Link from "next/link";
import {deauthorize} from "@/utils/authSlice";

//This is the page that the user themself sees (able to edit and such)

//TODO: Display links

function OthersInfoPage() {
    const router = useRouter();

    const token = useSelector(state => state.authorization.token); //get current state
    const dispatch = useDispatch(); // use to change state

    const [openEdit, setOpenEdit] = useState(false);
    const [id, setId] = useState(null);
    const [review, setReview] = useState('');
    const [user, setUser] = useState(null);
    const [thisUsername, setThisUsername] = useState(null);
    const [profile, setProfile] = useState(null);

    const {username} = router.query;

    const [ratingScore, setRatingScore] = useState(0);
    const [userCourses, setUserCourses] = useState([]);
    const [connectionCount, setConnectionCount] = useState(0);

    const [ratings, setRatings] = useState([]);
    const [requester, setRequester] = useState(null);
    const [requested, setRequested] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const [text, setText] = useState("Connect");

    const [pictureUrl, setPictureUrl] = useState(null);
    const [selectedConnection, setSelectedConnection] = useState(null);

    const api = axios.create({
        //baseURL: 'http://localhost:8080/',
        baseURL: 'http://34.16.169.60:8080/',
        headers: {'Authorization': `Bearer ${token}`},
    });



    useEffect(() => {
        try{
            // only authorized users can do this (must have token)
            const decodedUser = jwtDecode(token);
            setThisUsername(decodedUser.sub);

            const fetchData = async () => {
                fetchUser(username);
                //fetchProfile(username)
                await fetchUserCourses(username);
                fetchConnectionCount(username);
                await fetchRatingsForMe(username);
                await fetchAverageScore(username);
            };

            fetchConnection(username, decodedUser.sub);
            fetchData();

        }
        catch(err) {
            dispatch(deauthorize());
            router.push(`/error`);
        }
    }, [username]);

    const fetchUser = (user) => {
        console.log("User to fetch for: " + user);

        api.get(`me/${user}`)
            .then(data => setUser(data.data))
            .catch(error => console.error('Error fetching user:', error));
    };

    const fetchConnection = (user, thisUser) => {
        api.post(`api/searchUsers/getConnection/${thisUser}`, user)
            .then((res) => {
                setSelectedConnection(res.data);
                setRequester(res.data.requester);
                setRequested(res.data.requested);
                setIsConnected(res.data.isConnected);

                if(res.data.isConnected) {
                    setText("Disconnect");
                }
                else if(res.data.requester === thisUser) {
                    setText("Pending");
                }
                else {
                    setRequester(thisUser);
                    setRequested(user);
                    setIsConnected(false);
                    setText("Connect");
                }
            })
            .catch((err) => {
                console.error('Error getting connection:', err)
            });
    }

    const fetchConnectionCount = (user) => {

        api.get(`/api/viewConnections/getConnectionCount/${user}`)
            .then(data =>{
                setConnectionCount(data.data)
                console.log(data.data);}
            )
            .catch(error => console.error(`Error fetching connection count`, error));
    };

    const removeRating = (ratingId) => {
        console.log("Deleting rating with ID:", ratingId);
      
        // Use axios to send a DELETE request to the API
        api.delete(`deleteRating/${ratingId}`)
          .then(() => {
            console.log("Rating deleted successfully.");
            // Remove the deleted rating from the state
            setRatings(prevRatings => prevRatings.filter(rating => rating.ratingId !== ratingId));
          })
          .catch(error => console.error('Error deleting rating:', error));
      };

    const fetchAverageScore = async (user) => {
        try {
            const res = await api.get(`averageRating/${user}`);
            setRatingScore(res.data);
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

    const handleConnection = (event) => {
        // prevents page reload
        event.preventDefault();

        const connection = {
            requester, requested, isConnected
        }

        console.log(requester);
        console.log(requested);
        console.log(isConnected);
        // if the users are currently connected
        if(isConnected) {
            api.delete(`api/searchUsers/deleteConnection/${selectedConnection.id}`)
                .then((res) => {
                    if(res.status === 200) {
                        fetchConnection(username, thisUsername);
                    }
                })
                .catch((err) => {
                    console.log("ERROR DELETING CONNECTION.");
                    console.log(err);
                });
        }
        // the connection is pending
        else if(selectedConnection.requester === thisUsername) {
            console.log(username + " oops");
            // TODO: cancel connection??
        }
        // the users are not currently connected
        else {
            api.post("api/searchUsers/addConnection", connection)
                .then((res) => {
                    console.log("CONNECTION ADDED.");
                    if(res.status === 200) {
                        fetchConnection(username, thisUsername);
                    }
                })
                .catch((err) => {
                    console.log("ERROR ADDING CONNECTION.");
                    console.log(err);
                });
        }
    }
    const handleClickOpenEdit = (rating) => {
        console.log(rating);
        
        setRatingScore(rating.ratingScore);
        setReview(rating.review);
        setOpenEdit(true);
        setId(rating.ratingId);
        console.log(id);
      };
    
      const handleCloseEdit = () => {
        setOpenEdit(false);
      };

      const handleUpdateRating = async (id) => {
        try {
            console.log(id);
            // Check if id is valid
            if (!id || isNaN(id)) {
                console.error("Invalid rating ID");
                return;
            }
    
            // Create a new object with updated properties
            const updatedRating = {
                ratingId: id,
                score: parseFloat(ratingScore),
                review: review
            };
    
            const response = await api.put(`updateRating/${id}`, updatedRating);
            if (response.status === 200) {
                handleCloseEdit();
                fetchAverageScore(username);
                fetchRatingsForMe(username);
               
            }
            else {
                console.error("Failed to update rating.");
            }
        }
        catch (error) {
            console.error("Error updating rating:", error);
        }
      };

    return (
        <div>
            <Head>
                <title>{user?.username}'s Profile</title>
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
                                <div style={{ marginRight: '10px'}}>
                                    <span style={{ fontWeight: 'bold' }}>
                                        {connectionCount === 1 ? '1 ' : `${connectionCount} `}
                                    </span>
                                    <span style={{ color: 'blue', fontWeight: 'bold' }}>
                                        {connectionCount === 1 ? 'buddy' : 'buddies'}
                                    </span>
                                </div>

                                <div style={{ marginRight: '10px'}}>
                                    <Typography variant="body1" sx={{  fontStyle: 'italic', color: 'gray'}}>
                                        {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
                                    </Typography>
                                </div>

                            </Grid>

                            <Grid item sx={{ marginLeft: 'auto', marginRight: '100px', marginTop: '40px' }}>
                                <Button variant="outlined" color="error" onClick={() => router.back()} >Back</Button>
                                <Button
                                    id="connection"
                                    variant="contained"
                                    sx={{
                                        backgroundColor: isConnected ? '#9c27b0' : 'light blue',
                                        '&:hover': {
                                            backgroundColor: isConnected ? '#6d1b7b' : 'light blue'
                                        },
                                    }}
                                    type="submit"
                                    onClick={handleConnection}
                                >
                                    {text}</Button>
                            </Grid>
                        </Grid>
                        <br />

                        <Typography variant="body1" style={{ marginLeft: '100px' }}>
                            {user.bio}
                        </Typography>

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
                        </div>

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
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default OthersInfoPage;
