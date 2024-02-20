import React from 'react';
import Head from "next/head";
import {Box, Button, Card, CardContent, Stack, Typography} from "@mui/material";
import Link from "next/link";

function TutorLandingPage() {
  return (
      <>
          <Head>
              <title>LandingPage (Tutor)</title>
          </Head>

          <main>
              <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>

                  <Card sx={{ width: 600 }} elevation={4}>
                      <CardContent>
                          <Typography variant='h4' align='center'>Welcome Tutors!</Typography>
                          <Typography variant='b1' align='center'>This is Study Buddies. Find fellow tutors and students to connect with, create study meetups with your friends, and continue to guide student minds in the pursuit of knowledge.</Typography>
                      </CardContent>
                  </Card>

                  <Stack direction="row">
                      <Link href="/me" passHref>
                          <Button variant='contained' color="primary"> My Profile</Button>
                      </Link>

                      <Link href="/invitations" passHref>
                          <Button variant='contained' color="primary"> Invitations</Button>
                      </Link>

                      <Link href="/viewMeetups" passHref>
                          <Button variant='contained' color="primary"> View Meetups</Button>
                      </Link>

                      <Link href="/" passHref>
                          <Button variant='contained' color="secondary"> Log Out</Button>
                      </Link>
                  </Stack>

              </Stack>

              <Box sx={{ paddingTop: 60, paddingLeft: 70 }}>
                  <Typography variant="s2">By: StuCon</Typography>
              </Box>
          </main>
      </>
  );
}

export default TutorLandingPage;
