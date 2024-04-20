import React, {useEffect, useState} from 'react';
import Head from "next/head";

import {Box, Button, Card, CardContent, Stack, Typography} from "@mui/material";
import Link from "next/link";
import NotificationPage from "@/pages/Notification";
import {useDispatch, useSelector} from "react-redux";
import {jwtDecode} from "jwt-decode";
import {useRouter} from "next/navigation";
import {deauthorize} from "@/utils/authSlice";

function StudentLandingPage() {
    const router = useRouter();

    const token = useSelector(state => state.authorization.token); //get current state
    const dispatch = useDispatch(); // use to change state

    var [username, setUsername] = useState(null);
    useEffect(() => {
        try{
            // only authorized users can do this (must have token)
            const decodedUser = jwtDecode(token);
            setUsername(decodedUser.sub);
        }
        catch (err) {
            router.push(`/error`);
        }
    }, []);
    console.log("hi " + username);

    return (
        <>
            <Head>
                <title>LandingPage (Student)</title>
            </Head>

            <main>
                <NotificationPage></NotificationPage> <br/>
                <Stack sx={{paddingTop: 4}} alignItems='center' gap={2}>
                    <Card sx={{width: 600}} elevation={4}>
                        <CardContent>
                            <Typography variant='h4' align='center'>Welcome {username}!</Typography>
                            <Typography variant='b1' align='center'>This is Study Buddies. Find fellow students and
                                tutors to connect with, create study meetups with your friends, and continue to nurture
                                your mind in the pursuit of knowledge.</Typography>
                        </CardContent>
                    </Card>

                    <Stack direction="row">
                        <Link href={`/me`} passHref>
                            <Button variant='contained' color="primary"> My Profile</Button>
                        </Link>

                        <Link href={`/invitations`} passHref>
                            <Button variant='contained' color="primary"> Invitations</Button>
                        </Link>
                        <Link href={`/editCourse`} passHref>
                            <Button variant='contained' color="primary"> View Courses</Button>
                        </Link>

                        <Link href={`/viewMeetups`} passHref>
                            <Button variant='contained' color="primary"> View Meetups</Button>
                        </Link>
                        <Link href="/searchUsers" passHref>
                            <Button variant='contained' color="primary"> Search Users</Button>    
                        </Link>

                        <Link href={`/searchUsers`} passHref>
                            <Button variant='contained' color="primary"> Search Users</Button>
                        </Link>

                        <Link href={`/searchMeetups`} passHref>
                            <Button variant='contained' color="primary"> Search Meetups</Button>
                        </Link>

                        <Link href={`/viewConnections`} passHref>
                            <Button variant='contained' color="primary"> Connections</Button>
                        </Link>

                        <Link href={`/Notification`} passHref>
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
