import React, {useEffect, useState} from 'react';
import Head from "next/head";

import {Box, Button, Card, CardContent, Stack, Typography} from "@mui/material";
import Link from "next/link";
import NotificationPage from "@/pages/Notification";
import axios from "axios";
import {useRouter} from "next/router";
import SearchUsersPage from "@/pages/searchUsers";

function StudentLandingPage() {
    const [username, setUsername] = useState(null);
    const [user, setUser] = useState(null);
    const api = axios.create({
        //baseURL: 'http://localhost:8080/'
        baseURL: 'http://34.16.169.60:8080/'
    });
    const router = useRouter();

    useEffect( ()  => {
        const params = new URLSearchParams(window.location.search),
            name = params.get("username");
        setUsername(name);
        console.log(username);

        api.get(`users/${name}`)
            .then((res) => {
                setUser(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                window.alert("User not found");
            })
    }, [])
    console.log("hi " + username);

    return (
        <>
            <Head>
                <title>Home - (Student)</title>
            </Head>

            <main>
                <NotificationPage></NotificationPage> <br/>
                <Stack sx={{paddingTop: 4}} alignItems='center' gap={2}>
                    <Card sx={{width: 600}} elevation={1}>
                        <CardContent>
                            <Typography variant='h4' align='center'>Welcome {username}!</Typography>
                            <Typography variant='b1' align='center'>This is Study Buddies. Find fellow students and
                                tutors to connect with, create study meetups with your friends, and continue to nurture
                                your mind in the pursuit of knowledge.</Typography>
                        </CardContent>
                    </Card>

                    <Stack direction="row">
                        <Link href={`/me?username=${encodeURIComponent(username)}`} passHref>
                            <Button variant='contained' color="primary"> My Profile</Button>
                        </Link>

                        <Link href={`/invitations?username=${encodeURIComponent(username)}`} passHref>
                            <Button variant='contained' color="primary"> Invitations</Button>
                        </Link>
                        <Link href={`/editCourse?username=${encodeURIComponent(username)}`} passHref>
                            <Button variant='contained' color="primary"> View Courses</Button>
                        </Link>

                        <Link href={`/viewMeetups?username=${encodeURIComponent(username)}`} passHref>
                            <Button variant='contained' color="primary"> View Meetups</Button>
                        </Link>

                        <Link href={`/searchUsers?username=${encodeURIComponent(username)}`} passHref>
                            <Button variant='contained' color="primary"> Search Users</Button>
                        </Link>

                        <Link href={`/searchMeetups?username=${encodeURIComponent(username)}`} passHref>
                            <Button variant='contained' color="primary"> Search Meetups</Button>
                        </Link>

                        <Link href={`/viewConnections?username=${encodeURIComponent(username)}`} passHref>
                            <Button variant='contained' color="primary"> Connections</Button>
                        </Link>

                        <Link href={`/Notification?username=${encodeURIComponent(username)}`} passHref>
                            <Button variant='contained' color="primary"> Notifications</Button>
                        </Link>

                        <Link href="/" passHref>
                            <Button variant='contained' color="secondary"> Log Out</Button>
                        </Link>
                    </Stack>

                </Stack>
                <Box sx={{paddingTop: 60, paddingLeft: 70}}>
                    <Typography variant="s2">By: StuCon</Typography>
                </Box>
            </main>
        </>
    );
}

export default StudentLandingPage;
