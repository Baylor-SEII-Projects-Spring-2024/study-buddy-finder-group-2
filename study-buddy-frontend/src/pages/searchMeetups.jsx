import React, { useEffect, useState } from 'react';
import axios from "axios";
import dayjs from 'dayjs';
import { Box, Button, Card, CardContent, Typography, TextField, FormControl, InputLabel, Select, MenuItem, ThemeProvider, createTheme } from "@mui/material";
import NotificationPage from "@/pages/Notification";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import CreateIcon from '@mui/icons-material/Create';
import EventIcon from '@mui/icons-material/Event';

const theme = createTheme({
    palette: {
        primary: { main: '#a0c334' },
        secondary: { main: '#ffd700' }
    }
});

function SearchMeetupsPage() {
    const [searchStr, setStr] = useState('');
    const [username, setUsername] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [subject, setSubject] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [location, setLocation] = useState('');
    const [currentUser, setCurrentUser] = useState('');
    const [meetups, setMeetups] = useState([]);
    const [recommendedMeetups, setRecommendedMeetups] = useState([]);
    const [courses, setCourses] = useState([]);
    const api = axios.create({
        //baseURL: 'http://localhost:8080/'
        baseURL: 'http://34.16.169.60:8080/'
    });


    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const user = params.get("username");
        setCurrentUser(user);
        fetchCourses();
        fetchRecommendedMeetups(user);

        // console.log("Users in meetups:", meetups.map(meetup => meetup.attendees.map(attendee => attendee.username)).flat());
    }, []);

    const handleSearch = (str) => {
        setStr(str);
        setTitle(str);
    };

    const handleSubmit = async (event) => {
        // prevents page reload
        event.preventDefault();

        // get user time zone
        const options = await Intl.DateTimeFormat().resolvedOptions();
        const timezone = options.timeZone;

        const meetup = {
            username, title, description, subject, startDate, endDate, location
        }

        console.log("TITLEEEEEE: " + title);
        console.log("COURSEEEEE: " + subject);

        // TODO: set error for empty search
        // axios.post("http://localhost:8080/api/searchMeetups", meetup, {
        //     headers: {
        //         'timezone': timezone
        //     }}) // for local testing
        api.post("api/searchMeetups", meetup, {
               headers: {
               'timezone': timezone
            }})
            .then((res) => {
                console.log(meetup.title)
                console.log(meetup.subject)

                if(res.status === 200){
                    console.log(res.data[0])
                    setMeetups(res.data);
                }
            })
            .catch((err) => {
                console.log(err.value);
            });
    }

    const handleJoin = (meetup) => {
        console.log("JOINING")
        console.log(currentUser);
        console.log(meetup.id);

        api.post(`api/searchMeetups/${currentUser}?meetingId=${meetup.id}`)
            .then((res) => {
                if (res.status === 200) {
                    console.log('Joined meetup:', res.data);

                    // add the attendee to meetups state variable
                    const updatedMeetups = meetups.map(m => {
                        if(m.id === meetup.id){
                            return{
                                ...m,
                                attendees: [...m.attendees, { username: currentUser }]
                            };
                        }
                        return m;
                    });

                    setMeetups(updatedMeetups);
                }
            })
            .catch((err) => {
                console.error('Error joining meetup:', err);
            });
    };


    const handleLeave = (meetup) => {
        console.log("LEAVING")
        console.log(currentUser);
        console.log(meetup.id);

        axios.delete(`http://34.16.169.60:8080/api/searchMeetups/${currentUser}?meetingId=${meetup.id}`)
        //axios.delete(`http://localhost:8080/api/searchMeetups/${currentUser}?meetingId=${meetup.id}`)
            .then((res) => {
                if (res.status === 200) {
                    console.log('Left meetup:', res.data);

                // remove user from meetups state variable
                const updatedMeetups = meetups.map(m => {
                    if (m.id === meetup.id) {
                        return {
                            ...m,
                            attendees: m.attendees.filter(attendee => attendee.username !== currentUser)
                        };
                    }
                    return m;
                });

                setMeetups(updatedMeetups);
                }
            })
            .catch((err) => {
                console.error('Error leaving meetup:', err);
            });
    };

    const fetchCourses = () => {
        api.get(`http://34.16.169.60:8080/api/get-all-courses/`)
            .then(data => {
                setCourses(data.data)
                console.log(data.data);
            })
            .catch(error => console.error('Error fetching courses:', error));
    };

    const fetchRecommendedMeetups = (user) => {
        api.get(`recommendMeetups/${user}`)
            .then(response => {
                setRecommendedMeetups(response.data);
            })
            .catch(error => console.error('Error fetching recommended meetups:', error));
    };


    return (
        <ThemeProvider theme={theme}>
            <NotificationPage></NotificationPage> <br/>
            <Box sx={{ display: 'flex', flexDirection: 'row', p: 2 }}>
                <Box sx={{ width: '30%', marginRight: '2%' }}>
                    <Typography variant="h5" sx={{ mb: 2, color: 'primary.main' }}>Recommended Meetups</Typography>
                    {recommendedMeetups.map((meetup, index) => (
                        <Card key={index} sx={{ mb: 2 }} elevation={6}>
                            <CardContent>
                                <Typography><strong>Title:</strong> {meetup.title}</Typography>
                                <Typography><strong>Description:</strong> {meetup.description}</Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                <Box sx={{ width: '68%' }}>
                    <Card sx={{ mb: 2 }} elevation={6}>
                        <CardContent>
                            <Typography variant="h4" sx={{ color: 'primary.main' }}>Search Meetups</Typography>
                            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                                <TextField
                                    fullWidth
                                    id="search"
                                    label="Title of Meeting"
                                    variant="outlined"
                                    value={searchStr}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    sx={{ mb: 2 }}
                                />
                                <FormControl fullWidth variant="filled" sx={{ mb: 2 }}>
                                    <InputLabel id="courseType">Course</InputLabel>
                                    <Select
                                        labelId="select-course"
                                        id="select-course"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                    >
                                        <MenuItem value=""><em>None</em></MenuItem>
                                        {courses.map((course) => (
                                            <MenuItem key={course.courseId} value={course.coursePrefix + " " + course.courseNumber}>
                                                {course.coursePrefix} {course.courseNumber}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    sx={{ display: 'block', margin: '0 auto' }}
                                >
                                    Search
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>

                {/* Display meetup results */}
                {meetups
                .filter(meetup => meetup.username !== currentUser)
                .map((meetup, index) => (
                    <Card key={index} sx={{ height: 'auto', marginBottom: 2, width: '80%'}} elevation={6}>
                        <CardContent>
                            <div style={{ display: 'flex', marginTop: '5px', marginLeft: '250px', alignItems: 'center', justifyContent: 'flex-end'}}>
                                {Math.floor(dayjs(meetup.endDate).diff(dayjs(meetup.startDate), 'minute') / (24 * 60)) !== 0 && (
                                    <span style={{ marginRight: '10px', fontSize: '30px', color: 'gray' }}>
                                        {Math.floor(dayjs(meetup.endDate).diff(dayjs(meetup.startDate), 'minute') / (24 * 60))}D
                                    </span>
                                )}
                                {Math.floor((dayjs(meetup.endDate).diff(dayjs(meetup.startDate), 'minute') % (24 * 60)) / 60) !== 0 && (
                                    <span style={{ marginRight: '10px', fontSize: '30px', color: 'gray' }}>
                                        {Math.floor((dayjs(meetup.endDate).diff(dayjs(meetup.startDate), 'minute') % (24 * 60)) / 60)}HR
                                    </span>
                                )}
                                {dayjs(meetup.endDate).diff(dayjs(meetup.startDate), 'minute') % 60 !== 0 && (
                                    <span style={{ fontSize: '30px', color: 'gray' }}>
                                        {dayjs(meetup.endDate).diff(dayjs(meetup.startDate), 'minute') % 60}MIN
                                    </span>
                                )}
                            </div>
                        <Typography variant='h4' align='center' sx={{ marginTop: '20px', fontWeight: 'bold'}}>{meetup.title}</Typography>
                                    
                                    {/* TODO: FIX INDENTATION */}
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px', marginLeft: '10px'}}>
                                        <PersonIcon sx={{ fontSize: '25px', marginRight: '5px' }} />
                                        <span style={{ color: 'gray', fontStyle: 'italic', marginRight: '30px' }}>@{meetup.username}</span>
                                    </div>

                                    <br />

                                    
                                    <span style={{ marginLeft: '30px'}}>{meetup.description}</span>
                                    

                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px', marginLeft: '10px'}}>
                                        <CreateIcon sx={{ fontSize: '25px', marginRight: '5px' }} />
                                        <span>{meetup.subject}</span>
                                    </div>
                                    

                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px', marginLeft: '10px'}}>
                                        <EventIcon sx={{ fontSize: '25px', marginRight: '5px' }} />
                                        <span>{dayjs(meetup.startDate).format('MMMM DD, YYYY h:mm A')} - {dayjs(meetup.endDate).format('MMMM DD, YYYY h:mm A')}</span>
                                    </div>

                                    

                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px', marginLeft: '10px'}}>
                                        <LocationOnIcon sx={{ fontSize: '25px', marginRight: '5px' }} />
                                        <span>{meetup.location}</span>
                                    </div>

                                    <br />

                                    
                                    <Typography variant='h4' sx={{ fontSize: '15px', fontWeight: 'bold', marginLeft: '10px'}}>Attendees</Typography>
                                    <ul style={{ listStyleType: 'none', paddingInlineStart: '30px' }}>
                                        {meetup.attendees.map((attendee, index) => (
                                            <li key={index} style={{  color: 'gray', fontStyle: 'italic', marginRight: '20px'}}>{attendee.username}</li>
                                        ))}
                                    </ul>

                        {meetup.attendees.some(attendee => attendee.username === currentUser) ? (
                            <Button variant='contained' size="small" style={{ backgroundColor: 'red', color: 'white' }} onClick={() => handleLeave(meetup)}>
                                Leave Meetup
                            </Button>
                        ) : (
                            <Button variant='contained' color="primary" size="small" onClick={() => handleJoin(meetup)}>
                                Join Meetup
                            </Button>
                        )}
                        </CardContent>
                    </Card>
                ))}
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default SearchMeetupsPage;
