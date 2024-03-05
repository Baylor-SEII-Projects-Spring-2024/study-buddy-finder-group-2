import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Stack, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from '@mui/material';
import { DateTimeField, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';

//TODO: Be able to choose people from connections to add to meeting
//TODO: fix reducer thing in console log?
//TODO: Update the meetings once create has been hit, so call fetch
//TODO: Convert timezones from UTC?
//TODO: Convert from military time to AM/PM

function MeetupsPage() {
    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [subject, setSubject] = useState(null);
    const [date, setDate] = useState(null);
    const [location, setLocation] = useState(null);

    const handleSubmit = (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);

      const meeting = {
          title, description, subject, date, location
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
                    .catch(error => console.error('Error fetching meetups:', error));
                }
            })
            .catch((err) => {
                console.log("ERROR CREATING MEETING.");
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
            .catch(error => console.error('Error fetching meetups:', error));
    }, [])

    //DIALOG
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
                <Card sx={{ width: 300, margin: 'auto' }} elevation={4}>
                    <CardContent>
                        <Typography variant='h4' align='center'>Your Meetups</Typography>
                    </CardContent>
                </ Card>

                <ul>
                    {meetups.map((meetup, index) => (
                        <li key={index}>
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
                    ))}
                </ul>

                {/* TODO: Move buttons to side in row */}
                <Button variant='contained' color="primary" onClick={handleClickOpen}>Create Meetup</Button>
                <Button variant='contained' color="primary" style={{ backgroundColor: '#4CAF50', color: 'white' }}>Edit Meetup</Button>
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
            Set the title, description, date, and location of your meeting.
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

        <DateTimeField
        label="Date"
        value={date}
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
            onChange={(e) => setLocation(e.target.value)}
          />

        </DialogContent>

        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" onSubmit={handleSubmit}>Create</Button>
        </DialogActions>
        
      </Dialog>
    </LocalizationProvider>
        </div>
    );
}

export default MeetupsPage;