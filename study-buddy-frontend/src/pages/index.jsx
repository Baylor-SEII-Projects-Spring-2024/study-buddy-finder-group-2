import React from 'react';
import Head from 'next/head'
import { Button, Card, CardContent, Stack, Typography } from '@mui/material'
import Link from 'next/link';

// This was being used in the template project (idk for what)
//import styles from '@/styles/Home.module.css'

export default function HomePage() {
  // handle button press example
  /*const onButtonPress = () => {
    alert('You pressed a button!');
  }*/

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
          </Stack>

        </Stack>
      </main>
    </>
  );
}
