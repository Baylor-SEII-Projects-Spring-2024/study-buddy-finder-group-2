import React, { useEffect, useState } from 'react';
import axios from "axios";
import dayjs from 'dayjs';
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";

function SearchMeetupsPage() {
    const [searchStr, setStr] = useState(null);
    const [username, setUsername] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState(null);
    const [subject, setSubject] = useState('');
    const [date, setDate] = useState(null);
    const [location, setLocation] = useState(null);
    const [currentUser, setCurrentUser] = useState('');
    const [meetups, setMeetups] = useState([]);
    const [recommendedMeetups, setRecommendedMeetups] = useState([]);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const user = params.get("username");
        setCurrentUser(user);
        fetchCourses();
        fetchRecommendedMeetups(user);
    }, []);

    const handleSearch = (str) => {
        setStr(str);
        setTitle(str);
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // prevents page reload

        const meetup = {
            username, title, description, subject, date, location
        };

        axios.post("http://34.16.169.60:8080/api/searchMeetups", meetup)
        //axios.post("http://localhost:8080/api/searchMeetups", meetup)
            .then((res) => {
                if (res.status === 200) {
                    setMeetups(res.data);
                }
            })
            .catch((err) => {
                console.error('Error searching meetups:', err);
            });
    };
    const handleJoin = (meetup) => {
        console.log(currentUser);
        console.log(meetup.id);

        axios.post(`http://34.16.169.60:8080/api/searchMeetups/${currentUser}?meetingId=${meetup.id}`)
        //axios.post(`http://localhost:8080/api/searchMeetups/${currentUser}?meetingId=${meetup.id}`)
            .then((res) => {
                if (res.status === 200) {
                    console.log('Joined meetup:', res.data);
                    // Update your meetups state if necessary
                }
            })
            .catch((err) => {
                console.error('Error joining meetup:', err);
            });
    };

    const fetchCourses = () => {
        fetch(`http://34.16.169.60:8080/api/get-all-courses/`)
        //fetch(`http://localhost:8080/api/get-all-courses/`)
            .then(response => response.json())
            .then(data => {
                setCourses(Array.from(data))
                console.log(data);
            })
            .catch(error => console.error('Error fetching courses:', error));
    };

    const fetchRecommendedMeetups = (user) => {
        axios.get(`http://34.16.169.60:8080/recommendMeetups/${user}`)
        //axios.get(`http://localhost:8080/recommendMeetups/${user}`)
            .then(response => {
                setRecommendedMeetups(response.data);
            })
            .catch(error => console.error('Error fetching recommended meetups:', error));
    };


    return (
        <div style={{ display: 'flex' }}>
            {/* Recommended Meetups Section */}
            <div style={{ width: '30%', padding: '10px' }}>
                <Typography variant='h5' align='center'>Recommended Meetups</Typography>
                {recommendedMeetups.map((meetup, index) => (
                    <Card key={index} sx={{ marginBottom: 2 }} elevation={6}>
                        <CardContent>
                            <Typography><strong>Title:</strong> {meetup.title}</Typography>
                            <Typography><strong>Description:</strong> {meetup.description}</Typography>
                            {/* Add other details as needed */}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Existing Search Meetups Section */}
            <div style={{ width: '70%', padding: '10px' }}>
                <Card sx={{ width: 520, margin: 'auto' }} elevation={4}>
                    <CardContent>
                        <Typography variant='h4' align='center'>Search Meetups</Typography>
                    </CardContent>
                </ Card>

                {/* this is the search area, submits a form */}
                <Box component="form" noValidate onSubmit={handleSubmit}
                     sx={{ paddingTop: 3, width: 550, margin: 'auto' }}>
                    <Stack spacing={4} direction="row" justifyContent="center">
                        {/* search title */}
                        <TextField
                            required
                            id="search"
                            name="search"
                            label="Title of Meeting"
                            variant="outlined"
                            onChange={(e) => handleSearch(e.target.value)}
                        />

                        {/* select course*/}
                        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel required id="courseType">Course</InputLabel>
                            <Select
                                labelId="select course"
                                id="select course"
                                label="courseType"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            >
                                <MenuItem value=''><em>None</em></MenuItem>
                                {courses.map(course => {
                                    return (
                                        <MenuItem key={course.courseId} value={course.coursePrefix + " " + course.courseNumber}>
                                            {course.coursePrefix} {course.courseNumber}
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>

                        {/* submit the search form to get results */}
                        <Button
                            variant='contained'
                            color="primary"
                            type="submit"
                        >
                            Search</Button>
                    </Stack>
                </Box>

                {/* Display meetup results */}
                {meetups.map((meetup, index) => (
                    <Card key={index} sx={{ marginBottom: 2, width: 500}} elevation={6}>
                        <CardContent>
                            <Typography><strong>Title:</strong> {meetup.title}</Typography>
                            <Typography><strong>Creator:</strong> {meetup.username}</Typography>
                            <Typography><strong>Description:</strong> {meetup.description}</Typography>
                            <Typography><strong>Course:</strong> {meetup.subject}</Typography>
                            <Typography><strong>Date:</strong> {dayjs(meetup.date).format('MMMM DD, YYYY h:mm A')}</Typography>
                            <Typography><strong>Location:</strong> {meetup.location}</Typography>
                            <strong>Attendees:</strong>
                            <ul style={{ listStyleType: 'none', paddingInlineStart: '20px' }}>
                                {meetup.attendees.map((attendee, index) => (
                                    <li key={index}>{'\u00A0\u00A0'}{attendee.username}</li>
                                ))}
                            </ul>
                            <Button variant='contained' color="primary" size="small" onClick={() => handleJoin(meetup)}>
                                Join Meetup
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default SearchMeetupsPage;
