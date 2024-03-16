import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import Link from 'next/link';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

const images = [
  '/1.jpg',
  '/2.jpg'
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

  return (
    <>
      <Head>
        <title>Home Page</title>
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
        </div>

        <div style={{ width: '50%', backgroundColor: '#339966' }}>
          <Grid container sx={{ height: '100vh' }} alignItems="center" justifyContent="center">
            <Card sx={{ maxWidth: 450, boxShadow: 3, backgroundColor: '#ccffcc' }}>
              <CardContent>
                <Typography variant='h4' align='center' gutterBottom>Welcome to Study Buddies!</Typography>
                <Typography variant='body1' align='center'>Connect with peers to enhance your learning journey. Please login or register to continue.</Typography>
              </CardContent>
            </Card>

            <Grid container direction="column" alignItems="center" spacing={2} sx={{ mt: 2 }}>
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
            </Grid>
          </Grid>
        </div>
      </main>
    </>
  );
}
