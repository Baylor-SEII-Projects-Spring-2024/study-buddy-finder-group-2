import React from 'react';
import Head from "next/head";

import {Box, Button, Card, CardContent, Stack, TextField, Typography} from "@mui/material";
import Link from "next/link";

function LoginPage() {
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
                <Box sx={{ paddingTop: 5, width: 200, margin: 'auto' }}>
                    <Stack spacing={3}>
                        {/* username textbox */}
                        <TextField
                            required
                            id="username-required"
                            label="Username"
                            variant="outlined"
                            helperText="Enter your username."
                        />

                        {/* password textbox, text is hidden */}
                        {/* TODO: toggle visibility?? */}
                        <TextField
                            required
                            id="password-required"
                            type="password"
                            label="Password"
                            variant="outlined"
                            helperText="Enter your password."
                        />

                        {/* this box is used to make cancel/login horizontal */}
                        <Box sx={{ width: 200 }}>
                            <Stack spacing={4} direction="row" justifyContent="center">
                                {/*link the cancel button back to home page*/}
                                <Link href="/" passHref>
                                    <Button variant='contained' color="error" size="small">Cancel</Button>
                                </Link>

                                {/* link the login button to student landing page */}
                                {/* TODO: change link according to type of user */}
                                <Link href="/studentLanding" passHref>
                                    <Button variant='contained' color="primary" size="small">Login</Button>
                                </Link>
                            </Stack>
                        </Box>

                    </Stack>
                </Box>
            </main>
        </>
    );
}

export default LoginPage;
