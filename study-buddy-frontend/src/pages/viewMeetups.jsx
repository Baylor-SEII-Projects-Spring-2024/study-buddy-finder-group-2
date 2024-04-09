import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Stack, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Select, MenuItem, FormControl, InputLabel} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import NotificationPage from "@/pages/Notification";

//TODO: Bug where user able to input a bit of the date and it goes through

function MeetupsPage() {
    const [id, setId] = useState(null);
    const [username, setUsername] = useState(null);
    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [subject, setSubject] = useState(null);
    const [date, setDate] = useState(null);
    const [location, setLocation] = useState(null);
    const [attendees, setAttendees] = useState(new Set());

    const [selectedMeeting, setSelectedMeeting] = useState(null);

    const [meetups, setMeetups] = useState([]);
    const [courses, setCourses] = useState([]);
    const api = axios.create({
        //baseURL: 'http://localhost:8080/'
        baseURL: 'http://34.16.169.60:8080/'
    });


    useEffect(() => {
        const params = new URLSearchParams(window.location.search),
            user = params.get("username");

        setUsername(user);
        fetchMeetups(user);
        fetchCourses();
    }, [])

    const fetchMeetups = async (user) => {
        console.log("User to fetch for: " + user);

        // get user local time zone
        const options = await Intl.DateTimeFormat().resolvedOptions();
        const timezone = options.timeZone;

        // fetch(`http://localhost:8080/viewMeetups/${user}`, {
        //     headers: {
        //     'timezone': timezone
        //     }
        // })
        api.get(`viewMeetups/${user}`, {
            headers: {
                'timezone': timezone
            }
        })
            .then(data => setMeetups(data.data))
            .catch(error => console.error('Error fetching meetings:', error));
    };

    const fetchCourses = () => {
        api.get(`http://34.16.169.60:8080/api/get-all-courses/`)
            .then(data =>{
                setCourses(data.data)
                console.log(data);}
            )
            .catch(error => console.error('Error fetching courses:', error));
    };

    // CREATE
    const handleSubmit = (event) => {
        // prevents page reload
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const meeting = {
            id, username, title, description, subject, date, location
        }

        api.post("viewMeetups", meeting)
            .then((res) => {
                if(res.status === 200) {
                    handleClose();
                    fetchMeetups(username);
                }
            })
            .catch((err) => {
                console.log("ERROR CREATING MEETING.");
                console.log(err.value);
            });
    }

    const handleSubmitUpdate = async (event) => {
        // prevents page reload
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        // get user local time zone
        const options = await Intl.DateTimeFormat().resolvedOptions();
        const timezone = options.timeZone;

        const meeting = {
            id, username, title, description, subject, date, location, attendees
        }

        console.log("State variables after update");
        console.log("ID: " + id);
        console.log("username: " + username);
        console.log("title: " + title);
        console.log("desc: " + description);
        console.log("sub: " + subject);
        console.log("location: " + location);
        console.log("attendees: " + attendees);

        // axios.put("http://localhost:8080/viewMeetups", meeting, {
        //     headers: {
        //     'timezone': timezone
        //     }
        // })
        api.put("viewMeetups", meeting, {
            headers: {
                'timezone': timezone
            }
        })
            .then((res) => {
                if(res.status === 200) {
                    handleCloseEdit();
                    fetchMeetups(username);
                }
            })
            .catch((err) => {
                console.log("ERROR UPDATING MEETING.");
                console.log(err.value);
            });
    }

    // DELETE
    const handleDelete = (event) =>{
        event.preventDefault();

        api.delete(`viewMeetups/${selectedMeeting?.id}`)
            .then((res) => {
                if(res.status === 200) {
                    handleCloseEdit();
                    fetchMeetups(username);
                }
            })
            .catch((err) => {
                console.log("ERROR DELETING MEETING.");
                console.log(err.value);
            });
    }



    //DIALOG (CREATE MEETUP)
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setId(null);
        setSubject("");
        setOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const handleClose = () => {
        setOpen(false);
        document.body.style.overflow = 'auto';
    };

    //DIALOG 2 (EDIT MEETUP)
    const [openEdit, setOpenEdit] = React.useState(false);

    // takes in selected meeting to display content of that meeting
    const handleClickOpenEdit = (meetup) => {
        setSelectedMeeting(meetup);

        // set state variables to the currently selected meeting
        setId(meetup.id);
        setTitle(meetup.title);
        setDescription(meetup.description);
        setSubject(meetup.subject);
        setDate(meetup.date);
        setLocation(meetup.location);
        setAttendees(meetup.attendees);

        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
    };

    return (
        <div>
            <NotificationPage></NotificationPage> <br/>
            <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
                <Card sx={{ width: 300, margin: 'auto' }} elevation={4}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <SupervisorAccountIcon sx={{fontSize: 40, marginRight: '10px'}}/>
                        <Typography variant='h4' align='center'>Your Meetups</Typography>
                    </CardContent>
                </ Card>

                {meetups.map((meetup, index) => (
                    <Card key={index} sx={{ width: 500, margin: 'auto', marginTop: 1,
                        cursor: username === meetup.username ? 'pointer' : 'default'}}
                          elevation={6} onClick={() => {
                        if(username === meetup.username){
                            handleClickOpenEdit(meetup);
                        }
                    }}>
                        <CardContent>
                            <ul style={{ listStyleType: 'none', padding: 0, margin: 0}}>
                                <li>
                                    {/* <strong>ID: </strong> {meetup.id}
                                <br />*/}
                                    <strong>Creator: </strong> {meetup.username}
                                    <br />
                                    <strong>Title: </strong> {meetup.title}
                                    <br />
                                    <strong>Description: </strong> {meetup.description}
                                    <br />
                                    <strong>Course: </strong> {meetup.subject}
                                    <br />
                                    <strong>Date: </strong> {dayjs(meetup.date).format('MMMM DD, YYYY h:mm A')}
                                    <br />
                                    <strong>Location: </strong> {meetup.location}
                                    <br />
                                    <strong>Attendees:</strong>
                                    <ul style={{ listStyleType: 'none', paddingInlineStart: '20px' }}>
                                        {meetup.attendees.map((attendee, index) => (
                                            <li key={index}>{'\u00A0\u00A0'}{attendee.username}</li>
                                        ))}
                                    </ul>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                ))}

                <Button startIcon={<AddIcon />} variant='contained' color="primary" onClick={handleClickOpen}>Create</Button>
            </Stack>



            {/*CREATE MEETUP DIALOG BOX*/}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    component="form" validate="true" onSubmit={handleSubmit}
                    disableScrollLock={true}
                >
                    <DialogTitle>Create Meetup</DialogTitle>
                    <DialogContent>

                        <DialogContentText>
                            Set the title, description, course, date, and location of your meeting.
                        </DialogContentText>

                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="title"
                            name="title"
                            label="Title of Meeting"
                            type="string"
                            fullWidth
                            variant="standard"
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="description"
                            name="description"
                            label="Description of Meeting"
                            type="string"
                            fullWidth
                            variant="standard"
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <FormControl fullWidth required>
                            <InputLabel id="courses" sx={{ marginTop: '20px'}}>Select a Course</InputLabel>
                            <Select
                                labelId="courses"
                                id="dropdown"
                                sx={{ marginTop: '20px' }}
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                label="Select a Course"
                            >

                                {courses.map(course => {
                                    return (
                                        <MenuItem key={course.courseId} value={course.coursePrefix + " " + course.courseNumber}>
                                            {course.coursePrefix} {course.courseNumber}
                                        </MenuItem>
                                    )
                                })}

                            </Select>
                        </FormControl>

                        <DateTimePicker
                            label="Date"
                            onChange={(e) => setDate(e)}

                            //makes field required
                            slotProps={{
                                textField: {
                                    required: true,
                                    style: { marginTop: '20px' }
                                }
                            }}

                            disablePast
                        />

                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="location"
                            name="location"
                            label="Location of Meeting"
                            type="string"
                            fullWidth
                            variant="standard"
                            onChange={(e) => setLocation(e.target.value)}
                        />

                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button variant="contained" type="submit" onSubmit={handleSubmit} color="primary">Create</Button>
                    </DialogActions>

                </Dialog>
            </LocalizationProvider>



            {/*EDIT MEETUP DIALOG BOX*/}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Dialog
                    open={openEdit}
                    onClose={handleCloseEdit}
                    component="form" validate="true" onSubmit={handleSubmitUpdate}
                    disableScrollLock={true}
                >
                    <DialogTitle>Edit Meetup</DialogTitle>
                    <DialogContent>

                        <DialogContentText>
                            Edit the title, description, course, date, and location of your meeting.
                        </DialogContentText>

                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="title"
                            name="title"
                            label="Title of Meeting"
                            type="string"
                            fullWidth
                            variant="standard"
                            defaultValue={selectedMeeting?.title || ''}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="description"
                            name="description"
                            label="Description of Meeting"
                            type="string"
                            fullWidth
                            variant="standard"
                            defaultValue={selectedMeeting?.description || ''}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <FormControl fullWidth required>
                            <InputLabel id="courses" sx={{ marginTop: '20px'}}>Select a Course</InputLabel>
                            <Select
                                labelId="courses"
                                id="dropdown"
                                sx={{ marginTop: '20px' }}
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                label="Select a Course"
                            >

                                {courses.map(course => {
                                    return (
                                        <MenuItem key={course.courseId} value={course.coursePrefix + " " + course.courseNumber}>
                                            {course.coursePrefix} {course.courseNumber}
                                        </MenuItem>
                                    )
                                })}

                            </Select>
                        </FormControl>

                        <DateTimePicker
                            label="Date"
                            defaultValue={dayjs(selectedMeeting?.date)}

                            //makes field required
                            slotProps={{
                                textField: {
                                    required: true,
                                    style: { marginTop: '10px' }
                                }
                            }}

                            disablePast
                            onChange={(e) => setDate(e)}
                        />

                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="location"
                            name="location"
                            label="Location of Meeting"
                            type="string"
                            fullWidth
                            variant="standard"
                            defaultValue={selectedMeeting?.location || ''}
                            onChange={(e) => setLocation(e.target.value)}
                        />

                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleCloseEdit}>Cancel</Button>
                        <Button onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white' }}>Delete</Button>
                        <Button type="submit" onSubmit={handleSubmitUpdate} style={{ backgroundColor: 'purple', color: 'white' }}>Update</Button>
                    </DialogActions>

                </Dialog>
            </LocalizationProvider>
        </div>
    );
}

export default MeetupsPage;