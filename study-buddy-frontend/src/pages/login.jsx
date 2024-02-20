import React, {useState} from 'react';
import Head from "next/head";
import Link from "next/link";
import axios from "axios";

import {Box, Button, Card, CardContent, Stack, TextField, Typography} from "@mui/material";

function LoginPage() {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    // TODO: create a reducer function??

    // gets username and password data from the text fields
    const handleSubmit = (event) => {
        event.preventDefault();

        const user = {
            username,
            password
        };

        // connecting to backend to authorize user
        axios
            .post('http://localhost:8080/api/login', user)
            .then((res) => {
                if(res.status == 200) {
                    console.log('User is recognized!');
                    // TODO: redirect to a landing page
                }
            });
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
                            onChange={(e) => setUsername(e.target.value)}
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
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {/* TODO: find out why underline and color are not working*/}
                        <Link variant="s1"
                              align="center"
                              color="primary"
                              underline="hover"
                              href="/registration"
                        >
                            Create an Account!</Link>

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
