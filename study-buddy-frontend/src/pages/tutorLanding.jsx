import React, {useEffect, useState, useRef} from 'react';
import Head from "next/head";

import {
    Box,
    Button,
    Card,
    CardContent,
    useTheme,
    Stack,
    Typography,
    AppBar,
    Toolbar,
    CircularProgress, Tooltip, DialogTitle, DialogContent, DialogContentText, DialogActions, Dialog
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
import VisibilityIcon from "@mui/icons-material/Visibility";
// import Footer from "@/pages/Footer";
import NotificationsIcon from '@mui/icons-material/Notifications';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import NotesIcon from "@mui/icons-material/Notes";



function TutorLandingPage() {
    const router = useRouter();

    const token = useSelector(state => state.authorization.token); //get current state
    const dispatch = useDispatch(); // use to change state

    const [username, setUsername] = useState(null);
    const [user, setUser] = useState(null);
    const [recommendedUsers, setRecommendedUsers] = useState(null);
    const [recommendedMeetups, setRecommendedMeetups] = useState(null);
    const [notificationCount, setNotificationCount] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);



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
                    fetchCourseCount(decodedUser.sub);
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

    const fetchCourseCount = (username) => {
        api.get(`api/get-courses-user/${username}`)
            .then((res) => {
                if(res.data.length <= 0){
                    setDialogOpen(true);
                    console.log("No courses!");
                }
                else{
                    setDialogOpen(false);
                }
            })
            .catch((err) => console.log(err))
    }

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

    const handleUsernameClick = (username) => {
        router.push(`/other/${username}`);
        console.log(`Username ${username} clicked!`);
    };

    const handleDialogClick = () => {
        router.push(`/myProfile/`);
        console.log(`My Profile clicked!`);
    };

    // Function to generate a random gradient
    const getRandomGradient = () => {
        // Adjusted color palette to favor green and gold shades
        const colors = ['#a8e063', '#76b947', '#7dce82', '#c0e218', '#f9d423', '#ffcc33', '#eaffd0', '#f4d03f'];
        const randomColor1 = colors[Math.floor(Math.random() * colors.length)];
        const randomColor2 = colors[Math.floor(Math.random() * colors.length)];
        return `linear-gradient(45deg, ${randomColor1}, ${randomColor2})`;
    };

    const userCardRow = (users) => {
        return (
            <Stack sx={{
                overflow: 'auto',
                flexDirection: 'row'
            }}>
                {users && users.map((user, index) => (
                    <Card key={index} sx={{
                        margin: 5,
                        boxShadow: 3,
                        width: 350,
                        transition: 'transform 0.3s ease-in-out, background-color 0.3s ease',
                        background: getRandomGradient(),
                        '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: '5'
                        },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between' // Ensures that the button aligns to the bottom
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Avatar sx={{ width: 30, height: 30, marginBottom: '3px' }} src={user.pictureUrl} />
                                <strong>{user.firstName + " " + user.lastName}</strong>
                                <i>{user.userType}</i>
                            </Box>
                        </CardContent>
                        <Box sx={{ alignSelf: 'flex-end', padding: '8px' }}>
                            <Button
                                variant="contained"
                                sx={{
                                    minWidth: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    backgroundColor: '#2e7d32', // Dark green
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#1b5e20' // A slightly darker green on hover
                                    }
                                }}
                                onClick={() => handleUsernameClick(user.username)}
                            >
                                <VisibilityIcon /> {/* Assuming Material-UI icons are imported */}
                            </Button>
                        </Box>
                    </Card>
                ))}
            </Stack>
        );
    };


    const carouselMeetupMaker = (a) => {
        const chunkSize = 3;
        const arrays = [];

        if(a) {
            for (let i = 0; i < a.length; i += chunkSize)
                arrays.push(a.slice(i, i + chunkSize));
            return (
                arrays.map((section, index) => (
                    <Stack sx={{
                        flexDirection:'row',
                        marginBottom: 4 // Adds spacing between rows of cards
                    }} key={`stack-${index}`}>
                        {section.map((meetup, i) => (
                            <Card key={i} sx={{
                                margin: 2,
                                width: 400,
                                display:"flex",
                                justifyContent:"space-around",
                                alignItems:"center",
                                borderRadius: '16px', // Rounded corners
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Subtle shadow
                                backgroundColor: '#f0f0f0', // Light gray background for modern look
                                transition: 'box-shadow 0.3s', // Smooth shadow transition
                                '&:hover': {
                                    boxShadow: '0 6px 12px rgba(0,0,0,0.2)' // Enhanced shadow on hover
                                }
                            }}>
                                <CardContent>
                                    <Typography variant='h5' align='center' sx={{
                                        color: '#2e7d32',
                                        fontWeight: 'bold',
                                        marginTop: 2
                                    }}>{meetup.title}</Typography>

                                    <Tooltip title={"creator"}><PersonIcon sx={{fontSize: 20, mr: 1, color: 'primary.main'}}/></Tooltip>
                                    <span style={{
                                        color: 'gray',
                                        fontStyle: 'italic',
                                    }}>@{meetup.username}</span>
                                    <Typography
                                        sx={{mt: 1, color: '#666', fontSize: 14}}>
                                        <Tooltip title={"description"}>
                                            <NotesIcon sx={{fontSize: 20, mr: 1, color: 'primary.main'}}/></Tooltip>
                                        {meetup.description}</Typography>
                                    <Typography
                                        sx={{mt: 1, color: '#666', fontSize: 14}}>
                                        <Tooltip title={"subject"}>
                                            <CreateIcon sx={{fontSize: 20, mr: 1, color: 'primary.main'}} /> </Tooltip>
                                        {meetup.subject}</Typography>

                                    <Typography sx={{mt: 2, display: 'flex', alignItems: 'center', color: '#333'}}>
                                        <Tooltip title={"when"}>
                                            <EventIcon sx={{fontSize: 20, mr: 1, color: 'primary.main'}}/></Tooltip>
                                        {dayjs(meetup.startDate).format('MMMM DD, YYYY h:mm A')} - {dayjs(meetup.endDate).format('MMMM DD, YYYY h:mm A')}
                                    </Typography>

                                    <Typography sx={{display: 'flex', alignItems: 'center', mt: 1, color: '#333'}}>
                                        <Tooltip title={"where"}>
                                            <LocationOnIcon sx={{fontSize: 20, mr: 1, color: 'primary.main'}}/></Tooltip>
                                        {meetup.location}
                                    </Typography>

                                    <Typography variant='subtitle1'
                                                sx={{mt: 2, fontWeight: 'bold'}}>Attendees</Typography>
                                    <Typography variant='subtitle2'
                                                sx={{mt:1, fontWeight: 'bold'}}>Students</Typography>
                                    <Stack sx={{marginLeft:4}}>
                                        <ul sx={{listStyleType: 'none', padding: 0}}>
                                            {meetup.attendees.filter(attendee => attendee.userType === 'student').map((attendee, index) => (
                                                <li key={index} sx={{color: '#777', fontSize: 14, mt: 1}}>
                                                    <Avatar sx={{width: 20, height: 20, mr: 1}} src={attendee.pictureUrl}/>
                                                    <span onClick={() => handleUsernameClick(attendee.username)} style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}>{attendee.username}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </Stack>

                                    <Typography variant='subtitle2' sx={{mt: 1, fontWeight: 'bold'}}>Tutors</Typography>
                                    <Stack sx={{marginLeft:4}}>
                                        <ul sx={{listStyleType: 'none', padding: 0}}>
                                            {meetup.attendees.filter(attendee => attendee.userType === 'tutor').map((attendee, index) => (
                                                <li key={index} sx={{color: '#777', fontSize: 14, mt: 1}}>
                                                    <Avatar sx={{width: 20, height: 20, mr: 1}} src={attendee.pictureUrl}/>
                                                    <span onClick={() => handleUsernameClick(attendee.username)} style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}>{attendee.username}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </Stack>


                                    {meetup.attendees.some(attendee => attendee.username === username) ? (
                                        <Button variant='contained' color="error" sx={{
                                            mt: 2,
                                            width: '100%',
                                        }}
                                                onClick={() => handleLeave(meetup)}
                                        >
                                            Leave Meetup
                                        </Button>
                                    ) : (
                                        <Button variant='contained' sx={{
                                            mt: 2,
                                            width: '100%',
                                            backgroundColor: '#2e7d32', // Dark green color for the button
                                            '&:hover': {
                                                backgroundColor: '#1e4d27' // Darker shade of green on hover
                                            }
                                        }}
                                                onClick={() => handleJoin(meetup)}
                                        >
                                            Join Meetup
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
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

            <main style={{ backgroundColor: '#e8f5e9' }}> {/* Maintain the full width but control the content inside */}
                <NotificationPage></NotificationPage>
                <Stack sx={{ paddingTop: 4, alignItems: 'center', gap: 2 }}>
                    {/* Enhanced Notification Card */}
                    <Card sx={{
                        width: '100%', maxWidth: '800px', margin: 'auto',
                        background: 'linear-gradient(135deg, #a8e063 0%, #56ab2f 100%)', // Stylish green gradient
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)', // Soft shadow for depth
                        '&:hover': {
                            boxShadow: '0 6px 12px rgba(0,0,0,0.3)', // Enhanced shadow on hover
                        },
                        transition: 'box-shadow 0.3s ease-in-out' // Smooth transition for hover effect
                    }}>
                        <CardContent>
                            <Typography variant='h4' align='center' style={{ color: '#ffffff' }}>Welcome {username}!</Typography>
                            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                                <NotificationsIcon style={{ color: '#ffcc00' }} /> {/* Golden notification icon */}
                                <Typography variant='h5' align='center' style={{ color: '#ffffff' }}>
                                    You have {notificationCount} {notificationCount === 1 ? 'unread notification' : 'unread notifications'}.
                                </Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                </Stack>
                <Stack sx={{ paddingTop: 4, alignItems: 'center', gap: 2 }}>
                    {/* Info about users, making it slightly less prominent */}
                    <Box sx={{ margin: 5, width: '100%', maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto' }}>
                        <Typography variant='h2' style={{ color: '#2e7d32', textAlign: 'center' }}>Recommended Users</Typography>
                        <Typography variant='h6' color='textSecondary' style={{ textAlign: 'center' }}>Users we think you should become buddies with.</Typography>
                        {recommendedUsers && recommendedUsers.length > 0 ? userCardRow(recommendedUsers) : <div style={{ marginTop: '80px', marginLeft: '300px', marginBottom: '150px', fontSize: '20px', fontWeight: 'bold'}}>No users available.</div>}
                    </Box>
                </Stack>
                {/* Lazy-load Meetups Section */}
                <LazyLoadMeetups recommendedMeetups={recommendedMeetups} carouselMeetupMaker={carouselMeetupMaker} />

                <Dialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    sx={{ display:"flex",
                        justifyContent:"space-around",
                        justifyItems:"center",
                        alignItems:"center",
                    }}>
                    <DialogTitle>Let's get you some courses!</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Before anything happens, you should add some courses to get the right buddies for you!
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent:"space-around",
                        justifyItems:"center",
                        alignItems:"center",}}>
                        <Button onClick={() => handleDialogClick()} sx={{
                            width: '30%',
                            variant:"contained",
                            backgroundColor: '#2e7d32', // Dark green color for the button
                            '&:hover': {
                                backgroundColor: '#1e4d27' // Darker shade of green on hover
                            }}}><Typography color={"white"}>Let's Add Courses!</Typography></Button>
                        <Button variant="outlined" onClick={() => setDialogOpen(false)}>no thanks :(</Button>
                    </DialogActions>
                </Dialog>

                <br/>
            </main>
        </>
    );

    function LazyLoadMeetups({ recommendedMeetups, carouselMeetupMaker }) {
        const [headerVisible, setHeaderVisible] = useState(false);
        const [showArrow, setShowArrow] = useState(true);
        const meetupsRef = useRef(null);
        const arrowRef = useRef(null);

        useEffect(() => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.target === arrowRef.current) {
                            // The arrow should only disappear when it's fully out of view,
                            // Adjust the threshold to a higher value if needed or modify rootMargin to be more forgiving.
                            setShowArrow(entry.isIntersecting);
                        }
                    });
                },
                {
                    root: null,
                    rootMargin: '-30px',
                    threshold: 0.0
                }
            );

            if (arrowRef.current) {
                observer.observe(arrowRef.current);
            }

            return () => {
                if (arrowRef.current) {
                    observer.unobserve(arrowRef.current);
                }
                observer.disconnect();
            };
        }, []);

        useEffect(() => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.target === meetupsRef.current) {
                            if (entry.isIntersecting) {
                                setHeaderVisible(true);
                            } else {
                                setHeaderVisible(false);
                            }
                        }
                        if (entry.target === arrowRef.current) {
                            setShowArrow(!entry.isIntersecting);
                        }
                    });
                },
                {
                    root: null,
                    rootMargin: '-10px',
                    threshold: 0.3
                }
            );

            if (meetupsRef.current) {
                observer.observe(meetupsRef.current);
            }
            if (arrowRef.current) {
                observer.observe(arrowRef.current);
            }

            return () => {
                observer.disconnect();
            };
        }, []);


        return (
            <Box sx={{
                margin: 5,
                maxWidth: '1280px',
                marginLeft: 'auto',
                marginRight: 'auto',
                paddingBottom: 20 // increased padding to ensure more scroll space
            }}>
                {showArrow && (
                    <Box sx={{ textAlign: 'center', marginTop: 2, animation: 'bounce 2s infinite' }}>
                        <KeyboardArrowDownIcon sx={{ fontSize: 60, color: 'text.secondary' }} ref={arrowRef} />
                    </Box>
                )}
                <Box ref={meetupsRef} sx={{ opacity: headerVisible ? 1 : 0, transition: 'opacity 2s ease-in' }}>
                    <Typography variant='h2' style={{ textAlign: 'center', color: '#2e7d32' }}>
                        Recommended Meetups
                    </Typography>
                    <Typography variant='h6' color='textSecondary' style={{ textAlign: 'center' }}>
                        Meetups we think you should partake in.
                    </Typography>
                    {recommendedMeetups && recommendedMeetups.length > 0 ? arraySplitter(recommendedMeetups, carouselMeetupMaker) :
                        <div style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold' }}>No meetups available.</div>
                    }
                </Box>
            </Box>
        );
    }
}

export default TutorLandingPage;