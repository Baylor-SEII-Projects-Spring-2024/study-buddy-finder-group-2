import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Button, Card, CardContent, Grid, Typography, Stack } from '@mui/material';
import Link from 'next/link';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

const images = [
  '/1.png',
  '/2.png',
  '/3.png',
  '/4.png'
];

export default function HomePage() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const goldColor = '#FFD700'; // Gold
  const backgroundColor = '#339966'; // Right side background color

  return (
    <>
      <Head>
        <title>Studdy Buddy</title>
      </Head>

      <main style={{ height: '100vh', display: 'flex' }}>
        <div style={{ width: '50%', position: 'relative', overflow: 'hidden' }}>
          {images.map((src, index) => (
            <div
              key={src}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: currentImage === index ? 1 : 0,
                transition: 'opacity 1s ease-in-out',
                backgroundImage: `url(${src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          ))}
          {/* Gradient overlay */}
          <div style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '20%',
            background: `linear-gradient(to right, ${backgroundColor}00, ${backgroundColor}ff)`
          }}></div>
        </div>

        <div style={{ width: '50%', backgroundColor }}>
          <Grid container alignItems="center" justifyContent="center" style={{ height: '100vh' }}>
            <Grid item>
              <Stack direction="column" spacing={2} alignItems="center">
                <Card sx={{ maxWidth: 450, boxShadow: 3, backgroundColor: '#ccffcc', mb: 2 }}>
                  <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src="StuddyBuddyLogo.png" alt="logo" style={{ width: '400px'}}/>
                    <Typography variant='body1' align='center'>Connect with peers to enhance your learning journey. Please login or register to continue.</Typography>
                  </CardContent>
                </Card>

                <Stack direction="row" spacing={2}>
                  <Link href="/login" passHref>
                    <Button variant='contained' style={{ backgroundColor: goldColor, color: '#000' }} startIcon={<LoginIcon />}>
                      Login
                    </Button>
                  </Link>
                  <Link href="/registration" passHref>
                    <Button variant='contained' style={{ backgroundColor: goldColor, color: '#000' }} startIcon={<AppRegistrationIcon />}>
                      Register
                    </Button>
                  </Link>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </div>
      </main>
    </>
  );
}
