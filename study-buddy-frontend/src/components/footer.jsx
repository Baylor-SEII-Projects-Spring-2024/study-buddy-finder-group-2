import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import Link from 'next/link';

function Footer({ marginTop }) {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#2d4726', marginTop }}>
      <Toolbar>
        <Typography variant="body2" color="white">
          &copy; 2024 StuCon Corporation. All rights reserved.
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Footer;
