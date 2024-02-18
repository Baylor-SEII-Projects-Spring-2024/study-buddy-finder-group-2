import React from 'react';
import {Button, RadioGroup, TextField, Box, Grid} from '@mui/material/';
import {ButtonGroup, FormControlLabel, FormLabel, Radio, Typography} from "@mui/material";

function RegistrationPage() {
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            firstName: data.get('fname'),
            email: data.get('email'),
            password: data.get('password'),
        });
    };

  return (
      <Box>
          <Box component="form" noValidate onSubmit={handleSubmit}
               sx={{
                   marginTop: 5,
                   display: 'flex',
                   flexDirection: 'column',
                   alignItems: 'center',
          }}>
              <Typography component="h1" variant="h5">Register</Typography><br/>
              <TextField autoComplete="given-name" id="fname" name="fname" label="First Name"/><br/>
              <TextField autoComplete="last-name" id="lname" name="lname" label="Last Name"/><br/>
              <TextField autoComplete="email" id="email" name="email" label="Email"/><br/>
              <TextField id="username" name="username" label="Username"/><br/>
              <TextField autoComplete="new-password" type="password" id="password" name="password"
                         label="Password"/><br/>
              <TextField id="confirm_password" name="confirm_password"
                         label="Confirm Password"/><br/>
              <FormLabel htmlFor="user_type">Are you a:</FormLabel>
              <RadioGroup name="user_type" row={true}>
                  <FormControlLabel value="student" control={<Radio/>} id="user_student" label="Student"/>
                  <FormControlLabel value="tutor" control={<Radio/>} id="user_tutor" label="Tutor"/>
              </RadioGroup>
              <Box row={true}>
              <Button id="cancel" variant="contained" color="error" href="/">Cancel</Button>
              <Button id="register" variant="contained" type="submit">Register</Button>
              </Box>
          </Box>


      </Box>
  );
}

export default RegistrationPage;
