import React, {useEffect, useState} from 'react';
import Head from "next/head";

import {Box, Button, Card, CardContent, Stack, TextField, Typography} from "@mui/material";

function LoginPage() {
    // gets username and password data from the text fields
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            // takes data using the name field
            firstName: data.get('username'),
            password: data.get('password'),
        });

        // attempting to connect to backend
        /*useEffect(() => {
            fetch('http://localhost:8080/login') // use this for local development
                // fetch('http://34.16.169.60:8080/viewMeetups')
                .then(response => response.json())
                .then(data => setMeetups(data))
                .catch(error => console.error('Error fetching meetups:', error));
        }, [])*/
    };

    return (
        <>
            <Head>
                <title>Login Page</title>
            </Head>

            <main>
                {/* Welcome text */}
                <Box sx={{ paddingTop: 25, width: 400, margin: 'auto' }}>
                    <Card sx={{ width: 300, margin: 'auto' }} elevation={4}>
                        <CardContent>
                            <Typography variant='h6' align='center'>Welcome to</Typography>
                            <Typography variant='h4' align='center'>Study Buddies!</Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Stack of username, password, and cancel/login buttons */}
                <Box component="form" noValidate onSubmit={handleSubmit}
                     sx={{ paddingTop: 5, width: 200, margin: 'auto' }}>
                    <Stack spacing={3}>
                        {/* username text field */}
                        <TextField
                            required
                            id="username"
                            name="username"
                            label="Username"
                            variant="outlined"
                            helperText="Enter your username."
                        />

                        {/* password text field, text is hidden */}
                        {/* TODO: toggle visibility?? */}
                        <TextField
                            required
                            id="password"
                            name="password"
                            type="password"
                            label="Password"
                            variant="outlined"
                            helperText="Enter your password."
                        />

                        {/* this box is used to make cancel/login horizontal */}
                        <Box sx={{ width: 200 }} >
                            <Stack spacing={4} direction="row" justifyContent="center">
                                {/* cancel button linked back to home page */}
                                <Button
                                    id="cancel"
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    href="/"
                                >
                                    Cancel</Button>

                                {/* type submits a form to get username and password data */}
                                {/* TODO: link according to type of user */}
                                <Button
                                    id="login"
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    type="submit"
                                >
                                    Login</Button>
                            </Stack>
                        </Box>

                    </Stack>
                </Box>
            </main>
        </>
    );
}

export default LoginPage;
