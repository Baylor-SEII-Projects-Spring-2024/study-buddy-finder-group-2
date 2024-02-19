import React from 'react';
import {Button, RadioGroup, TextField, Box, Grid} from '@mui/material/';
import {ButtonGroup, FormControlLabel, FormLabel, MenuItem, Radio, Select, Typography} from "@mui/material";
import axios, {post} from "axios";

function RegistrationPage() {

    //password regex
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
    //username regex
    const USER_REGEX = /^\[A-z\][A-z0-9-_]{3,23}$/;
    // handles submission of form
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({ //testing form submission
            firstName: data.get('fname'),
            email: data.get('email'),
        });

        //verify that username is valid
        const verUser = USER_REGEX.test(data.get('username'));
        //verify that password is valid
        const verPwd = PWD_REGEX.test(data.get('password'));
        //verify that password is equal to confirm password
        const verMatch = data.get('password') === data.get('confirm_password');

        if(!verUser){
            console.log("invalid username");
            return;
        }
        else if(!verPwd){
            console.log("invalid password");
            return;
        }
        else if(!verMatch){
            console.log("passwords do not match");
            return;
        }

        try{
            //await axios.post("register_url", data );
        }
        catch(err){

        }

    };



    // registration page information
    const schools =[
        {
            value: 'baylor',
            label: 'Baylor University',
        },
        {
            value: 'tamu',
            label: 'A&M University',
        },
        {
            value: 'tcu',
            label: 'TCU University',
        }
    ]
    return (
      <Box>
          <Box component="form" validate="true" onSubmit={handleSubmit}
               sx={{
                   marginTop: 5,
                   display: 'flex',
                   flexDirection: 'column',
                   alignItems: 'center',
               }}>
              <Typography component="h1" variant="h5">Register</Typography><br/>
              <Select id="school" name="school" label="School" sx={{
                  m: 1, minWidth: 225
              }}>
                  {schools.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                          {option.label}
                      </MenuItem>
                  ))}
              </Select> <br/>
              <TextField autoComplete="given-name" id="fname" name="fname" label="First Name"/><br/>
              <TextField autoComplete="last-name" id="lname" name="lname" label="Last Name"/><br/>
              <TextField autoComplete="email" id="email" name="email" label="Email"/><br/>
              <TextField id="username" name="username" label="Username"/><br/>
              <TextField autoComplete="new-password" type="password" id="password" name="password"
                         label="Password"/><br/>
              <TextField id="confirm_password" name="confirm_password"
                         label="Confirm Password"/><br/>
              <FormLabel htmlFor="user_type">Are you a:</FormLabel>

              <RadioGroup name="user_type" row>
                  <FormControlLabel value="student" control={<Radio/>} id="user_student" label="Student"/>
                  <FormControlLabel value="tutor" control={<Radio/>} id="user_tutor" label="Tutor"/>
              </RadioGroup>
              <Box row>
                  <Button id="cancel" variant="outlined" color="error" href="/">Cancel</Button>
                  <Button id="register" variant="contained" type="submit">Next</Button>
              </Box>
          </Box>
      </Box>
  );
}

export default RegistrationPage;
