import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import Head from "next/head";
import Link from "next/link";
import axios from "axios";

import { jwtDecode } from "jwt-decode";

import {Box, Button, Card, CardContent, Stack, TextField, Typography} from "@mui/material";
import type {RootState} from "@/utils/redux";
import {authorize} from "@/utils/authSlice";

function LoginPage() {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const auth = useSelector((state: RootState) => state.authorizaiton.auth);
    const dispatch = useDispatch();

    // gets username and password data from the text fields
    const handleSubmit = (event) => {
        event.preventDefault();

        const user = {
            username,
            password
        };

        // connecting to backend to authorize user
        axios
            .post('http://localhost:8080/api/authorization/login', user) // for local testing
            //.post('http://34.16.169.60:8080/api/login', user)
            .then((res) => {
                var params = new URLSearchParams();
                console.log(res.data);

                // this is decoding the token to pass the username to the reducer function
                // decode does not return a JSON (returns a JwtPayload object)
                const token  = res.data;
                const decodedUser = jwtDecode(token);
                console.log(decodedUser);

                // TODO: should probably pass the token and decode when needed
                // this changes the state
                // token's subject is the username, which is a String
                dispatch(authorize(decodedUser.sub));
                console.log(auth);

                params.append("username", decodedUser.sub);
                console.log(decodedUser.sub + ' is recognized!');

                if(res.status === 200) {
                    // student landing page
                    console.log('User is a student');
                    //window.location = "/studentLanding?" + params.toString();
                }
                else if(res.status === 201) {
                    // tutor landing page
                    console.log('User is a tutor');
                    //window.location = "/tutorLanding?" + params.toString();
                }
            })
            // catches the bad response (error)
            .catch((err) => {
                console.log(err);
                window.alert('Incorrect username or password!');
            });
    };

    return (
        <>
            <Head>
                <title>Login Page</title>
            </Head>

            <main>
                {/* Welcome text */}
                <Box sx={{ paddingTop: 20, width: 400, margin: 'auto' }}>
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
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    href="/"
                                >
                                    Cancel</Button>

                                {/* type submits a form to get username and password data */}
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
