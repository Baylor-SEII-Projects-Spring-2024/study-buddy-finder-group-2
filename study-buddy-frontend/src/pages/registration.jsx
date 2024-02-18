import React from 'react';
import {Button, RadioGroup, TextField, Box, Grid} from '@mui/material/';
import {FormControlLabel, FormLabel, Radio} from "@mui/material";

function RegistrationPage() {
  return (
      <div>
          <h1>This is the registration page</h1>
          <Box component="form">
              <TextField autoComplete="given-name" id="fname" name="fname" label="First Name"/><br/>
              <TextField autoComplete="last-name" id="lname" name="lname" label="Last Name"/><br/>
              <TextField autoComplete="email" id="email" name="email" label="Email"/><br/>
              <TextField id="username" name="username" label="Username"/><br/>
              <TextField autoComplete="new-password" id="password" name="password" label="Password"/><br/>
              <TextField autoComplete="confirm-password" id="confirm_password" name="confirm_password"
                         label="Confirm Password"/><br/><br/>

              <RadioGroup name="user_type">
                  <FormLabel htmlFor="user_type">Are you a:</FormLabel>
                  <FormControlLabel value="student" control={<Radio/>} id="user_student" label="Student"/>
                  <FormControlLabel value="tutor" control={<Radio/>} id="user_tutor" label="Tutor"/>
              </RadioGroup>

              <Button id="cancel">Cancel</Button>
              <Button id="register">Register</Button>
          </Box>


      </div>
  );
}

export default RegistrationPage;
