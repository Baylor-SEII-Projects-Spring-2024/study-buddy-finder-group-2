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
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import CreateIcon from '@mui/icons-material/Create';
import EventIcon from '@mui/icons-material/Event';

function MeetupsPage() {
    const [id, setId] = useState(null);
    const [username, setUsername] = useState(null);
    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [subject, setSubject] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [location, setLocation] = useState(null);
    const [attendees, setAttendees] = useState(new Set());

    const [selectedMeeting, setSelectedMeeting] = useState(null);

    const [meetups, setMeetups] = useState([]);
    const [courses, setCourses] = useState([]);

    const api = axios.create({
        baseURL: 'http://localhost:8080/'
        //baseURL: 'http://34.16.169.60:8080/'
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

        api.get(`viewMeetups/${user}`, {
            headers: {
            'timezone': timezone
            }
        })
            .then(response => response.data)
            .then(data => setMeetups(data))
            .catch(error => console.error('Error fetching meetings:', error));
    };

    const fetchCourses = () => {
        api.get(`api/get-all-courses/`)
            .then(data =>{
                setCourses(data.data)
                console.log(data.data);}
            )
            .catch(error => console.error('Error fetching courses:', error));
    };

    // CREATE
    const handleSubmit = (event) => {
        // prevents page reload
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        // check if start and end date are complete
        if(isNaN(new Date(startDate)) || isNaN(new Date(endDate))) {
            alert("Please select valid start and end dates.");
            return;
        }

        // validate start and end times
        if(new Date(endDate) <= new Date(startDate)) {
            alert("End times cannot occur before or on start times.");
            return;
        }

        const meeting = {
            id, username, title, description, subject, startDate, endDate, location
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

        // validate start and end times
        if(new Date(endDate) <= new Date(startDate)) {
            alert("End times cannot occur before or on start times.");
            return;
        }

        // get user local time zone
        const options = await Intl.DateTimeFormat().resolvedOptions();
        const timezone = options.timeZone;

        const meeting = {
            id, username, title, description, subject, startDate, endDate, location, attendees
        }

        console.log("State variables after update");
        console.log("ID: " + id);
        console.log("username: " + username);
        console.log("title: " + title);
        console.log("desc: " + description);
        console.log("sub: " + subject);
        console.log("location: " + location);
        console.log("attendees: " + attendees);

        
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

    const handleDeleteExpire = (meetup) =>{
        api.delete(`viewMeetups/${meetup?.id}`)
            .then((res) => {
                if(res.status === 200) {
                    fetchMeetups(username);
                }
            })
            .catch((err) => {
                console.log("ERROR DELETING EXPIRED MEETING.");
                console.log(err.value);
            });
    }



    const handleLeave = (meetup) => {
        console.log("LEAVING")
        console.log(username);
        console.log(meetup.id);

        api.delete(`api/searchMeetups/${username}?meetingId=${meetup.id}`)
            .then((res) => {
                if (res.status === 200) {
                    console.log('Left meetup:', res.data);

                // remove user from meetups state variable
                const updatedMeetups = meetups.map(m => {
                    if (m.id === meetup.id) {
                        return {
                            ...m,
                            attendees: m.attendees.filter(attendee => attendee.username !== username)
                        };
                    }
                    return m;
                });

                setMeetups(updatedMeetups);

                fetchMeetups(username);
                }
            })
            .catch((err) => {
                console.error('Error leaving meetup:', err);
            });
    };



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
        setStartDate(meetup.startDate);
        setEndDate(meetup.endDate);
        setLocation(meetup.location);
        setAttendees(meetup.attendees);

        console.log("START OPEN EDIT: " + meetup.startDate);
        console.log("END OPEN EDIT: " + meetup.endDate);

        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
    };

    return (
        <div>
            <NotificationPage></NotificationPage> <br/>
            <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
                <Card sx={{ width: 'auto', margin: 'auto' }} elevation={4}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <SupervisorAccountIcon sx={{fontSize: 40, marginRight: '10px'}}/>
                        <Typography variant='h4' align='center'>{username}'s Meetups</Typography>
                    </CardContent>
                </ Card>

                {meetups.map((meetup, index) => (
                    <Card key={index} sx={{ width: 500, margin: 'auto', marginTop: 1, height: 'auto',
                        cursor: username === meetup.username && new Date(meetup.startDate) > new Date() ? 'pointer' : 'default', 

                        // red - expired, blue - ongoing, green - future
                        boxShadow: new Date(meetup.startDate) > new Date() ? '0 0 10px rgba(0, 255, 0, 0.5)' 
                        : new Date(meetup.endDate) < new Date() ? '0 0 10px rgba(255, 0, 0, 0.5)' 
                        : '0 0 10px rgba(0, 0, 255, 0.5)'}}
                          elevation={6} onClick={() => {
                        if(username === meetup.username && new Date(meetup.startDate) > new Date()){
                            handleClickOpenEdit(meetup);
                        }
                    }}>

                        <CardContent>
                            <ul style={{ listStyleType: 'none', padding: 0, margin: 0}}>
                                <li>
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

                                    {/* FIX INDENTATION */}
                                    <Typography variant='h4' align='center' sx={{ marginTop: '20px', fontWeight: 'bold'}}>{meetup.title}</Typography>
                                    
                                    
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

                                {/* attendee can leave meeting except when its ongoing */}
                                {meetup.username !== username && (new Date(meetup.startDate) > new Date() || new Date(meetup.endDate) < new Date()) ? (
                                    <Button variant='contained' size="small" style={{ backgroundColor: 'red', color: 'white' }} onClick={() => handleLeave(meetup)}>
                                        Leave Meetup
                                    </Button>
                                ) : (null)}

                                {/* appears when meetup you created is expired and you want to delete it */}
                                {meetup.username === username && new Date(meetup.endDate) <= new Date() ? (
                                    <Button variant='contained' size="small" style={{ backgroundColor: 'red', color:  'white' }} onClick={() => handleDeleteExpire(meetup)}>
                                        Delete Meetup
                                    </Button>
                                ) : (null)}
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
                            Set the title, description, course, start date, end date, and location of your meeting.
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
                            label="Start"
                            onChange={(e) => setStartDate(e)}

                            //makes field required
                            slotProps={{
                                textField: {
                                    required: true,
                                    style: { marginTop: '20px' }
                                }
                            }}

                            disablePast
                        />

                        <DateTimePicker
                            label="End"
                            onChange={(e) => setEndDate(e)}
                            sx = {{ marginLeft: '15px'}}

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
                            Edit the title, description, course, start date, end date, and location of your meeting.
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
                            label="Start"
                            defaultValue={dayjs(selectedMeeting?.startDate)}

                            //makes field required
                            slotProps={{
                                textField: {
                                    required: true,
                                    style: { marginTop: '20px' }
                                }
                            }}

                            disablePast
                            onChange={(e) => setStartDate(e)}
                        />

                        <DateTimePicker
                            label="End"
                            sx = {{ marginLeft: '15px'}}
                            defaultValue={dayjs(selectedMeeting?.endDate)}

                            //makes field required
                            slotProps={{
                                textField: {
                                    required: true,
                                    style: { marginTop: '20px' }
                                }
                            }}

                            disablePast
                            onChange={(e) => setEndDate(e)}
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