import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Stack, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

//TODO: Be able to choose people from connections to add to meeting
//TODO: Bug where user able to input a bit of the date and it goes through

function MeetupsPage() {
    const [id, setId] = useState(null);
    const [username, setUsername] = useState(null);
    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [subject, setSubject] = useState(null);
    const [date, setDate] = useState(null);
    const [location, setLocation] = useState(null);
    const [selectedMeeting, setSelectedMeeting] = useState(null);

    //GET MEETUPS (runs after every render) and set user
    const [meetups, setMeetups] = useState([]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search),
        user = params.get("username");

        setUsername(user);
        fetchMeetups(user);
    }, [])

    const fetchMeetups = async (user) => {
        console.log("User to fetch for: " + user);

        // get user local time zone
        const options = await Intl.DateTimeFormat().resolvedOptions();
        const timezone = options.timeZone;

        fetch(`http://localhost:8080/viewMeetups/${user}`, {
            headers: {
            'timezone': timezone
            }
        })
        // fetch(`http://34.16.169.60:8080/viewMeetups/${user}`, {
        //     headers: {
        //     'timezone': timezone
        //     }
        // })
          .then(response => response.json())
          .then(data => setMeetups(data))
          .catch(error => console.error('Error fetching meetings:', error));
    };

    // CREATE
    const handleSubmit = (event) => {
      // prevents page reload
      event.preventDefault();
      const data = new FormData(event.currentTarget);

      const meeting = {
          id, username, title, description, subject, date, location
      }

      axios.post("http://localhost:8080/viewMeetups", meeting) // for local testing
         //axios.post("http://34.16.169.60:8080/viewMeetups", meeting)
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
            id, username, title, description, subject, date, location
        }

        console.log("State variables after update");
        console.log("ID: " + id);
        console.log("username: " + username);
        console.log("title: " + title);
        console.log("desc: " + description);
        console.log("sub: " + subject);
        console.log("location: " + location);
  
        axios.put("http://localhost:8080/viewMeetups", meeting, {
            headers: {
            'timezone': timezone
            }
        })
        // axios.put("http://34.16.169.60:8080/viewMeetups", meeting, {
        //     headers: {
        //     'timezone': timezone
        //     }
        // })
              .then((res) => {
                  if(res.status === 200) {
                      handleCloseEdit();
                      fetchMeetups(username);
                  }
              })
              .catch((err) => {
                  console.log("ERROR UPDATING MEETING. TIMEZONE: " + timezone);
                  console.log(err.value);
              });
      }

    // DELETE
    const handleDelete = (event) =>{
        event.preventDefault();

      axios.delete(`http://localhost:8080/viewMeetups/${selectedMeeting?.id}`) // for local testing
        //axios.delete(`http://34.16.169.60:8080/viewMeetups/${selectedMeeting?.id}`)
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

        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
    };

    return (
        <div>
            <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
                <Card sx={{ width: 300, margin: 'auto' }} elevation={4}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <SupervisorAccountIcon sx={{fontSize: 40, marginRight: '10px'}}/>
                        <Typography variant='h4' align='center'>Your Meetups</Typography>
                    </CardContent>
                </ Card>

                {meetups.map((meetup, index) => (
                    <Card key={index} sx={{ width: 500, margin: 'auto', marginTop: 1, cursor: 'pointer'}} 
                    elevation={6} onClick={() => handleClickOpenEdit(meetup)}>
                        <CardContent>
                            <ul style={{ listStyleType: 'none', padding: 0, margin: 0}}>
                                <li>
                                {/* <strong>ID: </strong> {meetup.id}
                                <br />
                                <strong>Username: </strong> {meetup.username}
                                <br /> */}
                                <strong>Title: </strong> {meetup.title}
                                <br />
                                <strong>Description: </strong> {meetup.description}
                                <br />
                                <strong>Subject: </strong> {meetup.subject}
                                <br />
                                <strong>Date: </strong> {dayjs(meetup.date).format('MMMM DD, YYYY h:mm A')}
                                <br />
                                <strong>Location: </strong> {meetup.location}
                                <br />
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                ))}

                <Button  startIcon={<AddIcon />} variant='contained' color="primary" onClick={handleClickOpen}>Create</Button>
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
            Set the title, description, subject, date, and location of your meeting.
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

        {/* TODO: MAKE DROPDOWN MENU OF ALL THE USERS COURSES INSTEAD */}
        <TextField
            autoFocus
            required
            margin="dense"
            id="subject"
            name="subject"
            label="Subject"
            type="string"
            fullWidth
            variant="standard"
            onChange={(e) => setSubject(e.target.value)}
          />

        <DateTimePicker
            label="Date"
            onChange={(e) => setDate(e)}

            //makes field required
            slotProps={{
                textField: {
                required: true,
                style: { marginTop: '10px' }
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
            Edit the title, description, subject, date, and location of your meeting.
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

        {/* TODO: MAKE DROPDOWN MENU OF ALL THE USERS COURSES INSTEAD */}
        <TextField
            autoFocus
            required
            margin="dense"
            id="subject"
            name="subject"
            label="Subject"
            type="string"
            fullWidth
            variant="standard"
            defaultValue={selectedMeeting?.subject || ''}
            onChange={(e) => setSubject(e.target.value)}
          />

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