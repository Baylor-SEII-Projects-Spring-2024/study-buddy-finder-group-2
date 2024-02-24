import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Stack, Typography } from '@mui/material';

function MeetupsPage() {
    const [meetups, setMeetups] = useState([]);

    useEffect(() => {
        //fetch('http://localhost:8080/viewMeetups') // use this for local development
        fetch('http://34.16.169.60:8080/viewMeetups')
            .then(response => response.json())
            .then(data => setMeetups(data))
            .catch(error => console.error('Error fetching meetups:', error));
    }, [])

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
                        <li key={index}>{meetup}</li>
                    ))}
                </ul>

                <Button variant='contained' color="primary">Create Meetup</Button>
                <Button variant='contained' color="primary" style={{ backgroundColor: '#4CAF50', color: 'white' }}>Edit Meetup</Button>
            </Stack>
        </div>
    );
}

export default MeetupsPage;
