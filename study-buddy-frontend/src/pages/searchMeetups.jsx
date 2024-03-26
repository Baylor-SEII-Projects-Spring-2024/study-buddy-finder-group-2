import React, {useEffect, useState} from 'react';
import axios from "axios";
import dayjs from 'dayjs';

import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";

function SearchMeetupsPage() {
  const [searchStr, setStr] = useState(null);
  const [username, setUsername] = useState(null);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [course, setCourse] = useState(null);
  const [date, setDate] = useState(null);
  const [location, setLocation] = useState(null);

  const [meetups, setMeetups] = useState([]);
  const [courses, setCourses] = useState([]);

  // get the user's username
  useEffect(() => {
    const params = new URLSearchParams(window.location.search),
        user = params.get("username");

        //fetchCourses();

        // setRequester(user);
    }, [])

    // get the string the to search with
    const handleSearch = (str) => {
        setStr(str);

        setTitle(str);
        //setCourse(str);
    };

    // const fetchCourses = () => {
    //     fetch(`http://localhost:8080/api/get-all-courses/`)
    //     // fetch(`http://34.16.169.60:8080/api/get-all-courses/`)
    //       .then(response => response.json())
    //       .then(data =>{
    //         setCourses(Array.from(data))   
    //         console.log(data);}
    //         )
    //       .catch(error => console.error('Error fetching courses:', error));
    // };

  const handleSubmit = (event) => {
    // prevents page reload
    event.preventDefault();

    const meetup = {
        username, title, description, course, date, location
    }

    // TODO: set error for empty search
    axios.post("http://localhost:8080/api/searchMeetups", meetup) // for local testing
    //axios.post("http://34.16.169.60:8080/api/searchMeetups", meetup)
        .then((res) => {
            console.log(meetup.title)
            console.log(meetup.username)

            if(res.status === 200){
                console.log(res.data[0])
                setMeetups(res.data);
                //fetchUsers(searchStr);
            }
        })
        .catch((err) => {
            console.log(err.value);
        });
}

  return (
    <div>
        <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
            <Card sx={{ width: 520, margin: 'auto' }} elevation={4}>
                <CardContent>
                    <Typography variant='h4' align='center'>Search Meetups</Typography>
                </CardContent>
            </ Card>

            

            {/* this is the search area, submits a form */}
            <Box component="form" noValidate onSubmit={handleSubmit}
                     sx={{ paddingTop: 3, width: 550, margin: 'auto' }}>
                    <Stack spacing={4} direction="row" justifyContent="center">
                        {/* get search string for meetup name*/}
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
                            <InputLabel required id="userType">User Type</InputLabel>
                            <Select
                                labelId="select userType"
                                id="select userType"
                                label="userType"
                                onChange={(e) => setType(e.target.value)}
                            >
                                <MenuItem value={null}>
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={"student"}>Student</MenuItem>
                                <MenuItem value={"tutor"}>Tutor</MenuItem>
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

                            
                {meetups.map((meetup, index) => (
                        <Card key={index} sx={{ marginBottom: 2, width: 500}} elevation={6}>
                            <CardContent>
                                <Typography><strong>Title:</strong> {meetup.title}</Typography>
                                <Typography><strong>User:</strong> {meetup.username}</Typography>
                                <Typography><strong>Description:</strong> {meetup.description}</Typography>
                                <Typography><strong>Course:</strong> {meetup.subject}</Typography>
                                <Typography><strong>Date:</strong> {dayjs(meetup.date).format('MMMM DD, YYYY h:mm A')}</Typography>
                                <Typography><strong>Location:</strong> {meetup.location}</Typography>
                                {/* <Button variant='contained' color="primary" size="small" onClick={() => handleClickOpenProfile(user)}>
                                    View Profile
                                </Button> */}
                            </CardContent>
                        </Card>
                    ))}
        </Stack>
    </div>
  );
}

export default SearchMeetupsPage;
