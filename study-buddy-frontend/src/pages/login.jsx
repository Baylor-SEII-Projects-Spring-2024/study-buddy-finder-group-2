import React from 'react';
import Head from "next/head";

import {Box, Button, Card, CardContent, Stack, TextField, Typography} from "@mui/material";

function LoginPage() {
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            // takes data using the name field
            firstName: data.get('username'),
            password: data.get('password'),
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
                        {/* username textbox */}
                        <TextField
                            required
                            id="username"
                            name="username"
                            label="Username"
                            variant="outlined"
                            helperText="Enter your username."
                        />

                        {/* password textbox, text is hidden */}
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
