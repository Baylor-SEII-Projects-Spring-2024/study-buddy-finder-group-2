import React from 'react';
import Head from 'next/head'
import { Button, Card, CardContent, Stack, Typography } from '@mui/material'
import styles from '@/styles/Home.module.css'
import Link from 'next/link';

export default function HomePage() {
  const onButtonPress = () => {
    alert('You pressed a button!');
  }

  return (
    <>
      <Head>
        <title>Home Page</title>
      </Head>

      <main>
        <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
          <Card sx={{ width: 600 }} elevation={4}>
            <CardContent>
              <Typography variant='h4' align='center'>Welcome to Study Buddies!</Typography>
              <Typography variant='h6' align='center'>By: StuCon</Typography>
              <Typography variant='s1' align='center'>This application is made by students for students. We support students and tutors in order to foster connections and encourage the development of new skills.</Typography>
            </CardContent>
          </Card>

          <Stack direction="row">
            <Link href="/login" passHref>
              <Button variant='contained' color="primary"> Login</Button>
            </Link>

            <Link href="/registration" passHref>
              <Button variant='contained' color="primary"> Register</Button>
            </Link>

            <Link href="/invitations" passHref>
              <Button variant='contained' color="primary"> Invitations</Button>
            </Link>

            <Link href="/viewMeetups" passHref>
              <Button variant='contained' color="primary"> View meetups</Button>
            </Link>
          </Stack>

        </Stack>
      </main>
    </>
  );
}
