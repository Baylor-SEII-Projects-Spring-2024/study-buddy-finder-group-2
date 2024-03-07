import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Stack, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import axios from 'axios';

//TODO: Be able to choose people from connections to add to meeting
//TODO: Connect users and their meetings
//TODO: Bug where user able to input a bit of the date and it goes through
//TODO: fix reducer thing in console log?
//TODO: Convert timezones from UTC
//TODO: Convert from military time to AM/PM

function MeetupsPage() {
    const [id, setId] = useState(null);
    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [subject, setSubject] = useState(null);
    const [date, setDate] = useState(null);
    const [location, setLocation] = useState(null);

    const [selectedMeeting, setSelectedMeeting] = useState(null);

    // CREATE
    const handleSubmit = (event) => {
      // prevents page reload
      event.preventDefault();
      const data = new FormData(event.currentTarget);

      const meeting = {
          id, title, description, subject, date, location
      }

      //axios.post("http://localhost:8080/viewMeetups", meeting) // for local testing
        axios.post("http://34.16.169.60:8080/viewMeetups", meeting)
            .then((res) => {
                if(res.status === 200) {
                    handleClose();

                    //refetch the meetups
                    //fetch('http://localhost:8080/viewMeetups') // use this for local development
                    fetch('http://34.16.169.60:8080/viewMeetups')
                    .then(response => response.json())
                    .then(data => setMeetups(data))
                    .catch(error => console.error('Error fetching meetings:', error));
                }
            })
            .catch((err) => {
                console.log("ERROR CREATING MEETING.");
                console.log(err.value);
            });
    }

    const handleSubmitUpdate = (event) => {
        // prevents page reload
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const meeting = {
            id, title, description, subject, date, location
        }

        console.log("State variables after update");
        console.log("ID: " + id);
        console.log("title: " + title);
        console.log("desc: " + description);
        console.log("sub: " + subject);
        console.log("location: " + location);
  
        //axios.put("http://localhost:8080/viewMeetups", meeting) // for local testing
          axios.put("http://34.16.169.60:8080/viewMeetups", meeting)
              .then((res) => {
                  if(res.status === 200) {
                      handleCloseEdit();
  
                      //refetch the meetups
                      //fetch('http://localhost:8080/viewMeetups') // use this for local development
                      fetch('http://34.16.169.60:8080/viewMeetups')
                      .then(response => response.json())
                      .then(data => setMeetups(data))
                      .catch(error => console.error('Error fetching meetings:', error));
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

      //axios.delete(`http://localhost:8080/viewMeetups/${selectedMeeting?.id}`) // for local testing
        axios.delete(`http://34.16.169.60:8080/viewMeetups/${selectedMeeting?.id}`)
            .then((res) => {
                if(res.status === 200) {
                    handleCloseEdit();

                    //refetch the meetups
                    //fetch('http://localhost:8080/viewMeetups') // use this for local development
                    fetch('http://34.16.169.60:8080/viewMeetups')
                    .then(response => response.json())
                    .then(data => setMeetups(data))
                    .catch(error => console.error('Error fetching meetings:', error));
                }
            })
            .catch((err) => {
                console.log("ERROR DELETING MEETING.");
                console.log(err.value);
            });
    }




    //GET MEETUPS (runs after every render)
    const [meetups, setMeetups] = useState([]);

    useEffect(() => {
        //fetch('http://localhost:8080/viewMeetups') // use this for local development
        fetch('http://34.16.169.60:8080/viewMeetups')
            .then(response => response.json())
            .then(data => setMeetups(data))
            .catch(error => console.error('Error fetching meetings:', error));
    }, [])

    //DIALOG (CREATE MEETUP)
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setId(null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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
                    <CardContent>
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
                                <br /> */}
                                <strong>Title: </strong> {meetup.title}
                                <br />
                                <strong>Description: </strong> {meetup.description}
                                <br />
                                <strong>Subject: </strong> {meetup.subject}
                                <br />
                                <strong>Date: </strong> {meetup.date}
                                <br />
                                <strong>Location: </strong> {meetup.location}
                                <br />
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                ))}

                <Button variant='contained' color="primary" onClick={handleClickOpen}>Create Meetup</Button>
            </Stack>

        

      {/*CREATE MEETUP*/}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Dialog
            open={open}
            onClose={handleClose}

             component="form" validate="true" onSubmit={handleSubmit}
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
                }
            }}
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








    {/*EDIT MEETUP*/}
    <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Dialog
            open={openEdit}
            onClose={handleCloseEdit}

             component="form" validate="true" onSubmit={handleSubmitUpdate}
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
                }
            }}

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