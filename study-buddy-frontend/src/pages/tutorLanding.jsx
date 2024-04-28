import React, {useEffect, useState} from 'react';
import Head from "next/head";
// import Footer from '@/pages/footer';

import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog, DialogActions, DialogContent,
    DialogTitle,
    List,
    ListItem,
    Paper,
    Stack,
    Typography,
    AppBar,
    Toolbar
} from "@mui/material";
import Link from "next/link";
import NotificationPage from "@/pages/Notification";
import axios from "axios";
import {useRouter} from "next/router";
import Carousel from "react-material-ui-carousel";
import PersonIcon from "@mui/icons-material/Person";
import CreateIcon from "@mui/icons-material/Create";
import EventIcon from "@mui/icons-material/Event";
import dayjs from "dayjs";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {useDispatch, useSelector} from "react-redux";
import {jwtDecode} from "jwt-decode";
import Avatar from '@mui/material/Avatar';
import {deauthorize} from "@/utils/authSlice";

function TutorLandingPage() {
    const router = useRouter();

    const token = useSelector(state => state.authorization.token); //get current state
    const dispatch = useDispatch(); // use to change state

    const [username, setUsername] = useState(null);
    const [user, setUser] = useState(null);
    const[other, setSelectedUser] = useState(null);
    const [recommendedUsers, setRecommendedUsers] = useState(null);
    const [recommendedMeetups, setRecommendedMeetups] = useState(null);
    const [text, setText] = useState("Connect");
    const[otherFirstName, setOtherFirstName] = useState(null);
    const[otherLastName, setOtherLastName] = useState(null);
    const [otherEmailAddress, setOtherEmail] = useState(null);
    const [otherUserType, setOtherType] = useState(null);
    const [otherSchool, setOtherSchool] = useState(null);
    const [otherUsername, setOtherUsername] = useState(null);
    const [id, setId] = useState(null);
    const [requester, setRequester] = useState(null);
    const [requested, setRequested] = useState(null);
    const [isConnected, setIsConnected] = useState(null);
    const [selectedConnection, setSelectedConnection] = useState(null);
    const [openProfile, setOpenProfile] = useState(false);
    const [notificationCount, setNotificationCount] = useState(false);


    const api = axios.create({
        //baseURL: 'http://localhost:8080/',
        baseURL: 'http://34.16.169.60:8080/',
        headers: {'Authorization': `Bearer ${token}`},

    });

    useEffect( ()  => {
        try{
            // only authorized users can do this (must have token)
            const decodedUser = jwtDecode(token);
            setUsername(decodedUser.sub);

            api.get(`users/${decodedUser.sub}`)
                .then((res) => {
                    setUser(res.data);
                    console.log(res.data);
                    fetchRecommendations(decodedUser.sub);
                    fetchRecommendedMeetups(decodedUser.sub);
                    fetchNotificationCount(decodedUser.sub);
                })
                .catch((err) => {
                    window.alert("User not found");
                })
        }
        catch(err) {
            dispatch(deauthorize());
            router.push(`/error`);
        }
    }, [])
    console.log("hi " + username);

    const fetchRecommendations = (username) => {
        api.get(`api/recommendations/${username}`)
            .then((response) => {
                setRecommendedUsers(response.data);
            })
            .catch((error) => {
                console.error('Error fetching recommendations:', error);
            });
    };

    const fetchRecommendedMeetups = async (username) => {
        // get user time zone
        const options = await Intl.DateTimeFormat().resolvedOptions();
        const timezone = options.timeZone;

        api.get(`recommendMeetups/${username}`, {
            headers: {
                'timezone': timezone
            }
        })
            .then(response => {
                setRecommendedMeetups(response.data);
            })
            .catch(error => console.error('Error fetching recommended meetups:', error));
    }

    const fetchNotificationCount = (username) => {
        api.get(`api/notification/getNotificationCount/${username}`)
            .then((response) => {
                setNotificationCount(response.data);
            })
            .catch((error) => {
                console.error('Error fetching notification count:', error);
            });
    };
    const handleUsernameClick = (username) => {
        router.push(`/other/${username}`);
        console.log(`Username ${username} clicked!`);
    };

    const handleJoin = (meetup) => {
        // get up to date version of the meetup to make sure its not deleted
        api.get(`viewMeetup/${meetup.id}`)
            .then(response => {
                if(response.data === null){
                    alert("This meetup has been removed. You cannot join it.");
                }
            })
            .catch(error => console.error('Error getting meetup', error));


        if(new Date(meetup.startDate) <= new Date()){
            alert("This meetup has expired. You cannot join it.");
            return;
        }

        console.log("JOINING")
        console.log("Joiner: " + username);
        console.log("Creator: " + meetup.username);
        console.log("Meeting Id: " + meetup.id);

        api.post(`api/searchMeetups/${username}?meetingId=${meetup.id}&creator=${meetup.username}`)
            .then((res) => {
                if (res.status === 200) {
                    console.log('Joined meetup:', res.data);

                    // add the attendee to recommend meetups state variable
                    const updatedRecommended = recommendedMeetups.map(m => {
                        if(m.id === meetup.id){
                            return{
                                ...m,
                                attendees: [...m.attendees, { username: username}]
                            };
                        }
                        return m;
                    });

                    setRecommendedMeetups(updatedRecommended);
                }
            })
            .catch((err) => {
                console.error('Error joining meetup:', err);
            });
    };

    const handleLeave = (meetup) => {
        // get up to date version of the meetup to make sure its not deleted
        api.get(`viewMeetup/${meetup.id}`)
            .then(response => {
                if(response.data === null){
                    alert("This meetup has been removed. You cannot leave it.");
                    return;
                }
            })
            .catch(error => console.error('Error getting meetup', error));


        if(new Date(meetup.startDate) <= new Date()){
            alert("This meetup is ongoing or has expired. You cannot leave it.");
            return;
        }

        console.log("LEAVING")
        console.log(username);
        console.log(meetup.id);

        api.delete(`api/searchMeetups/${username}?meetingId=${meetup.id}`)
            .then((res) => {
                if (res.status === 200) {
                    console.log('Left meetup:', res.data);

                // remove user from recommend meetups state variable
                const updatedRecommended = recommendedMeetups.map(m => {
                    if (m.id === meetup.id) {
                        return {
                            ...m,
                            attendees: m.attendees.filter(attendee => attendee.username !== username)
                        };
                    }
                    return m;
                });

                setRecommendedMeetups(updatedRecommended);
                }
            })
            .catch((err) => {
                console.error('Error leaving meetup:', err);
            });
    };

    function handleClickOpenProfile(other) {
        setSelectedUser(other);

        // set state variables to the currently selected user
        setOtherUsername(other.username);
        setOtherFirstName(other.firstName);
        setOtherLastName(other.lastName);
        setOtherEmail(other.emailAddress);
        setOtherType(other.userType);
        setOtherSchool(other.school);


        api.post(`api/searchUsers/getConnection/${username}`, other.username)
            .then((res) => {
                setSelectedConnection(res.data);
                setRequester(res.data.requester);
                setRequested(res.data.requested);
                setIsConnected(res.data.isConnected);
                setId(res.data.id);

                if(res.data.isConnected) {
                    setText("Disconnect");
                }
                else if(res.data.requester === username) {
                    setText("Pending");
                }
            })
            .catch((err) => {
                console.error('Error getting connection:', err)
            });

        setOpenProfile(true);
    }

    const handleCloseProfile = () => {
        setOpenProfile(false);

        // must reset values for continued search!!
        setOtherUsername(null);
        setOtherFirstName(null);
        setOtherLastName(null);
        setOtherEmail(null);
        setOtherType(null);
        setOtherSchool(null);

        setSelectedConnection(null);
        setRequested(null);
        setRequester(null);
        setIsConnected(false);

        setText("Connect");
    };

    const handleSetConnection = () => {
        if(!isConnected) {
            setRequester(username);
            setRequested(other.username);
            setIsConnected(false);
        }
    }

    const handleConnection = (event) => {
        // prevents page reload
        event.preventDefault();

        const connection = {
            requester, requested, isConnected
        }

        // if the users are currently connected
        if(isConnected) {
            api.delete(`api/searchUsers/deleteConnection/${selectedConnection?.id}`)
                .then((res) => {
                    if(res.status === 200) {
                        handleCloseProfile();
                    }
                })
                .catch((err) => {
                    console.log("ERROR DELETING CONNECTION.");
                    console.log(err);
                });
        }
        // the connection is pending
        else if(selectedConnection.requester === username) {
            console.log(username + " oops");
            // TODO: cancel connection??
        }
        // the users are not currently connected
        else {


            api.post("api/searchUsers/addConnection", connection)
                .then((res) => {
                    console.log("CONNECTION ADDED.");
                    if(res.status === 200) {
                        handleCloseProfile();
                    }
                })
                .catch((err) => {
                    console.log("ERROR ADDING CONNECTION.");
                    console.log(err);
                });
        }
    }


    const carouselUserMaker = (a) => {
        const chunkSize = 3;
        const arrays = [];

        if(a) {
            for (let i = 0; i < a.length; i += chunkSize)
                arrays.push(a.slice(i, i + chunkSize))
            return (
                arrays.map((section, index) => (
                    <Stack sx={{
                        overflow: 'auto',
                        flexDirection:'row'}} key={`stack-${index}`}>
                        {section ? section.map((user, i) => (
                            <Card key={i} sx={{margin:5, boxShadow:4, width: 350}}>
                            <CardContent>
                                <Stack spacing={13} direction="row" justifyContent="space-evenly">
                                    <Box >
                                        <Avatar sx={{ width: 30, height: 30, marginBottom: '3px' }} src={user.pictureUrl} />
                                        <strong>{user.username}</strong>
                                        <br/>
                                        <i>{user.firstName + " " + user.lastName}</i>
                                        <br/>
                                    </Box>
                                    <Button
                                        variant='contained'
                                        color="primary"
                                        size="small"
                                        sx={{ width: '100px', height: '40px' }}
                                        onClick={() => handleUsernameClick(user.username)}
                                    >
                                        View Profile</Button>
                                </Stack>
                                {/* Other user details here */}
                            </CardContent>
                        </Card>
                        )) : console.log("Nope")}

                    </Stack>
                ))
            );
        }

    }

    const carouselMeetupMaker = (a) => {
        const chunkSize = 3;
        const arrays = [];

        if(a) {
            for (let i = 0; i < a.length; i += chunkSize)
                arrays.push(a.slice(i, i + chunkSize))
            return (
                arrays.map((section, index) => (
                    <Stack sx={{
                        flexDirection:'row'}} key={`stack-${index}`}>
                        {section ? section.map((meetup, i) => (
                            <Card key={i} sx={{margin:5, width: 400}}>
                                <CardContent>
                                    <Typography variant='h4' align='center' sx={{ marginTop: '20px', fontWeight: 'bold', fontSize: '20px' }}>{meetup.title}</Typography>

                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px', marginLeft: '5px'}}>
                                        <PersonIcon sx={{ fontSize: '20px', marginRight: '5px' }} />
                                        <span style={{ color: 'gray', fontStyle: 'italic', marginRight: '20px', fontSize: '14px' }}>@{meetup.username}</span>
                                    </div>

                                    <br />

                                    <span style={{ marginLeft: '20px', fontSize: '14px' }}>{meetup.description}</span>

                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px', marginLeft: '5px'}}>
                                        <CreateIcon sx={{ fontSize: '20px', marginRight: '5px' }} />
                                        <span style={{ fontSize: '14px' }}>{meetup.subject}</span>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px', marginLeft: '5px'}}>
                                        <EventIcon sx={{ fontSize: '20px', marginRight: '5px' }} />
                                        <span style={{ fontSize: '14px' }}>{dayjs(meetup.startDate).format('MMMM DD, YYYY h:mm A')} - {dayjs(meetup.endDate).format('MMMM DD, YYYY h:mm A')}</span>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px', marginLeft: '5px'}}>
                                        <LocationOnIcon sx={{ fontSize: '20px', marginRight: '5px' }} />
                                        <span style={{ fontSize: '14px' }}>{meetup.location}</span>
                                    </div>

                                    <br />

                                    <Typography variant='h4' sx={{ fontSize: '15px', fontWeight: 'bold', marginLeft: '5px'}}>Attendees</Typography>
                                    {/* map students */}
                                    <ul style={{ listStyleType: 'none', paddingInlineStart: '30px' }}>
                                        <Typography variant='h6' sx={{ fontSize: '13px', fontWeight: 'bold', marginLeft: '10px' }}>Students</Typography>
                                        {meetup.attendees.filter(attendee => attendee.userType === 'student').map((attendee, index) => (
                                            <li key={index} style={{ color: 'gray', fontStyle: 'italic', marginRight: '20px', display: 'flex', alignItems: 'center' }}>
                                                <Avatar sx={{ width: 20, height: 20, marginRight: '5px' }} src={attendee.pictureUrl} />
                                                <span onClick={() => handleUsernameClick(attendee.username)} style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}>{attendee.username}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* map tutors */}
                                    <ul style={{ listStyleType: 'none', paddingInlineStart: '30px' }}>
                                        <Typography variant='h6' sx={{ fontSize: '13px', fontWeight: 'bold', marginLeft: '10px', marginTop: '5px'}}>Tutors</Typography>
                                        {meetup.attendees.filter(attendee => attendee.userType === 'tutor').map((attendee, index) => (
                                            <li key={index} style={{ color: 'gray', fontStyle: 'italic', marginRight: '20px', display: 'flex', alignItems: 'center' }}>
                                                <Avatar sx={{ width: 20, height: 20, marginRight: '5px' }} src={attendee.pictureUrl} />
                                                
                                                    {username !== attendee.username && ( // Compare the usernames
                                                        <span onClick={() => handleUsernameClick(attendee.username)} style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}>
                                                            {attendee.username}
                                                        </span>
                                                    )}
                                                    {username === attendee.username && (
                                                        <span>{attendee.username}</span> // Render differently if the usernames are equal
                                                    )}
                                            </li>
                                        ))}
                                    </ul>

                                    {meetup.attendees.some(attendee => attendee.username === username) ? (
                                        <Button variant='contained' size="small" style={{ backgroundColor: 'red', color: 'white', marginTop: '10px'}} onClick={() => handleLeave(meetup)}>
                                            Leave Meetup
                                        </Button>
                                    ) : (
                                        <Button variant='contained' color="primary" size="small" style={{ marginTop: '10px' }} onClick={() => handleJoin(meetup)}>
                                            Join Meetup
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        )) : console.log("Nope")}
                    </Stack>
                ))
            );
        }

    }

    const arraySplitter = (prop, func) => {
        return(
            <Carousel animation="slide" autoPlay={false}>
                {func(prop)}
            </Carousel>
        );
    }

    return (
        <>
            <Head>
                <title>Home Page</title>
            </Head>

            <main>
                <NotificationPage></NotificationPage> <br/>
                <Stack sx={{paddingTop: 4}} alignItems='center' gap={2}>
                    <Card sx={{width: 600}} elevation={1}>
                        <CardContent>
                            <Typography variant='h4' align='center'>Welcome {username}!</Typography>
                            <div style={{ display: 'inline-block', marginLeft: '170px'}}>You have</div>
                            <div style={{ display: 'inline-block', margin: '0 5px', color: 'blue'}}>{notificationCount}</div>


                            <div style={{ display: 'inline-block'}}>
                                {notificationCount === 1 ? 'unread notification.' : 'unread notifications.'}
                            </div>
                        </CardContent>
                    </Card>

                </Stack>
                <Box sx={{margin:5}}>
                    <Typography variant='h2'>Recommended Users</Typography>
                    <Typography variant='h6' color='textSecondary'>Users we think you should become buddies with.</Typography>
                    {recommendedUsers && recommendedUsers.length > 0 ? arraySplitter(recommendedUsers, carouselUserMaker):
                    <div style={{ marginTop: '80px', marginLeft: '300px', marginBottom: '150px', fontSize: '20px', fontWeight: 'bold'}}>No users available.</div>
                    }

                </Box>
                <Box sx={{margin:5}}>
                    <Typography variant='h2'>Recommended Meetups</Typography>
                    <Typography variant='h6' color='textSecondary'>Meetups we think you should partake in.</Typography>
                    {recommendedMeetups && recommendedMeetups.length > 0 ? arraySplitter(recommendedMeetups, carouselMeetupMaker):
                    <div style={{ marginTop: '80px', marginLeft: '300px', marginBottom: '150px', fontSize: '20px', fontWeight: 'bold'}}>No meetups available.</div>
                    }

                </Box>

                <AppBar position="static" sx={{ backgroundColor: '#2d4726'}}>
                <Toolbar>
                    <Typography variant="body2" color="white">
                    &copy; 2024 StuCon Corporation. All rights reserved.
                    </Typography>
                </Toolbar>
                </AppBar>


            </main>
            {/*View user profile and add as connection*/}
            {/*
            <Dialog
                open={openProfile}
                onClose={handleCloseProfile}
                fullWidth
                component="form"
                validate="true"
                onSubmit={handleConnection}
            >
                <DialogTitle variant='s2'>{otherFirstName + " " + otherLastName}'s Profile</DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                        <Typography variant='s2'>{otherUserType}</Typography>
                        <Typography variant='s2'></Typography>
                        <Typography variant='s1'>Username: {otherUsername}</Typography>
                        <Typography variant='s1'>Email: {otherEmailAddress}</Typography>
                        {/* <Typography variant='s1'>School: {otherSchool}</Typography> }
                        <Typography variant='s1'>Courses...</Typography>
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleCloseProfile}
                    >
                        Cancel</Button>
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
                        onClick={handleSetConnection}
                    >
                        {text}</Button>
                </DialogActions>
            </Dialog>
            */}
        </>
    );
}

export default TutorLandingPage;