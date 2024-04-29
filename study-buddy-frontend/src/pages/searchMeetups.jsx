import React, { useEffect, useState } from 'react';
import axios from "axios";
import dayjs from 'dayjs';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ThemeProvider,
    createTheme,
    Tooltip
} from "@mui/material";
import NotificationPage from "@/pages/Notification";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import CreateIcon from '@mui/icons-material/Create';
import EventIcon from '@mui/icons-material/Event';
import {jwtDecode} from "jwt-decode";
import {useRouter} from "next/navigation";
import {useDispatch, useSelector} from "react-redux";
import Avatar from '@mui/material/Avatar';
import Head from "next/head";
import {deauthorize} from "@/utils/authSlice";
import NotesIcon from "@mui/icons-material/Notes";

const theme = createTheme({
    palette: {
        primary: { main: '#a0c334' },
        secondary: { main: '#ffd700' }
    }
});

function SearchMeetupsPage() {
    const router = useRouter();

    const token = useSelector(state => state.authorization.token); //get current state
    const dispatch = useDispatch(); // use to change state

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
        baseURL: 'http://localhost:8080/',
        //baseURL: 'http://34.16.169.60:8080/',
        // must add the header to associate requests with the authenticated user
        headers: {'Authorization': `Bearer ${token}`,},
    });

    useEffect(() => {
        try{
            // only authorized users can do this (must have token)
            const decodedUser = jwtDecode(token);
            setCurrentUser(decodedUser.sub);

            fetchCourses();
            fetchRecommendedMeetups(decodedUser.sub);
        }
        catch(err) {
            dispatch(deauthorize());
            router.push(`/error`);
        }
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

        api.post("api/searchMeetups", meetup, {
            headers: {
                'timezone': timezone,
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
                    return;
                }
            })
            .catch(error => console.error('Error getting meetup', error));


        if(new Date(meetup.startDate) <= new Date()){
            alert("This meetup has expired. You cannot join it.");
            return;
        }

        console.log("JOINING")
        console.log("Joiner: " + currentUser);
        console.log("Creator: " + meetup.username);
        console.log("Meeting Id: " + meetup.id);

        api.post(`api/searchMeetups/${currentUser}?meetingId=${meetup.id}&creator=${meetup.username}`)
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

                    // add the attendee to recommend meetups state variable
                    const updatedRecommended = recommendedMeetups.map(m => {
                        if(m.id === meetup.id){
                            return{
                                ...m,
                                attendees: [...m.attendees, { username: currentUser }]
                            };
                        }
                        return m;
                    });

                    setMeetups(updatedMeetups);
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
        console.log(currentUser);
        console.log(meetup.id);

        api.delete(`api/searchMeetups/${currentUser}?meetingId=${meetup.id}`)
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

                // remove user from recommend meetups state variable
                const updatedRecommended = meetups.map(m => {
                    if (m.id === meetup.id) {
                        return {
                            ...m,
                            attendees: m.attendees.filter(attendee => attendee.username !== currentUser)
                        };
                    }
                    return m;
                });

                setMeetups(updatedMeetups);
                setRecommendedMeetups(updatedRecommended);
                }
            })
            .catch((err) => {
                console.error('Error leaving meetup:', err);
            });
    };

    const fetchCourses = () => {
        api.get(`api/get-all-courses/`)
            .then(data =>{
                setCourses(data.data)
                console.log(data.data);
            })
            .catch(error => console.error('Error fetching courses:', error));
    };

    const fetchRecommendedMeetups = async (user) => {
        // get user time zone
        const options = await Intl.DateTimeFormat().resolvedOptions();
        const timezone = options.timeZone;

        api.get(`recommendMeetups/${user}`, {
            headers: {
                'timezone': timezone,
            }})
            .then(response => {
                setRecommendedMeetups(response.data);
            })
            .catch(error => console.error('Error fetching recommended meetups:', error));
    };

    return (
        <ThemeProvider theme={theme}>
            <Head>
                <title>Search Meetups</title>
            </Head>
            <NotificationPage></NotificationPage> <br/>
            <Box sx={{ display: 'flex', flexDirection: 'row', p: 2 }}>
                <Box sx={{ width: '30%', marginRight: '2%' }}>
                    <Typography variant="h5" sx={{ mb: 2, color: 'primary.main' }}>Recommended Meetups</Typography>
                    {recommendedMeetups.filter(r => new Date(r.startDate) > new Date()).map((meetup, index) => (
                        <Card key={index} sx={{
                            margin: 2,
                            width: 350,
                            height: 500,
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
                                <ul sx={{listStyleType: 'none', padding: 0}}>
                                    {meetup.attendees.filter(attendee => attendee.userType === 'student').map((attendee, index) => (
                                        <li key={index} sx={{color: '#777', fontSize: 14, mt: 1}}>
                                            <Avatar sx={{width: 20, height: 20, mr: 1}} src={attendee.pictureUrl}/>
                                            {attendee.username}
                                        </li>
                                    ))}
                                </ul>

                                <Typography variant='subtitle2' sx={{mt: 1, fontWeight: 'bold'}}>Tutors</Typography>
                                <ul sx={{listStyleType: 'none', padding: 0}}>
                                    {meetup.attendees.filter(attendee => attendee.userType === 'tutor').map((attendee, index) => (
                                        <li key={index} sx={{color: '#777', fontSize: 14, mt: 1}}>
                                            <Avatar sx={{width: 20, height: 20, mr: 1}} src={attendee.pictureUrl}/>
                                            {attendee.username}
                                        </li>
                                    ))}
                                </ul>


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
                                                {course.coursePrefix} {course.courseNumber} of {course.school.schoolName}
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
                .filter(meetup => meetup.username !== currentUser && new Date(meetup.startDate) > new Date())
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
                        
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px', marginLeft: '10px'}}>
                                <PersonIcon sx={{ fontSize: '25px', marginRight: '5px' }} />
                                <span style={{ color: 'gray', fontStyle: 'italic', marginRight: '30px' }}>Owner: @{meetup.username}</span>
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

                                    
                            <Typography variant='h4' sx={{ fontSize: '15px', fontWeight: 'bold', marginLeft: '10px', marginBottom: '15px'}}>Attendees</Typography>

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
                                                    <span onClick={() => handleUsernameClick(attendee.username)} style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}>{attendee.username}</span>
                                                </li>
                                            ))}
                                        </ul>

                        {meetup.attendees.some(attendee => attendee.username === currentUser) ? (
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
                ))}
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default SearchMeetupsPage;
