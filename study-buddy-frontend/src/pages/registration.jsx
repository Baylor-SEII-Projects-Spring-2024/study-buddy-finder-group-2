import React, {useState} from 'react';
import {Button, RadioGroup, TextField, Box, Grid} from '@mui/material/';
import {ButtonGroup, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, Select, Typography} from "@mui/material";
import axios from "axios";
//import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';


function RegistrationPage() {
    // Database looks for attribute name, not column name when assigning attributes to new row
    // emailAddress and userType need no underscores
    const [username, setUsername] = useState(null);
    const [name, setName] = useState(null);
    const [password, setPassword] = useState(null);
    const [emailAddress, setEmail] = useState(null);
    const [userType, setType] = useState(null);


    //password regex
    const PWD_REGEX = /^[A-z]+$/;
    //username regex
    const USER_REGEX = /^\[A-z]{3,23}$/;
    // handles submission of form
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const user = {
            username, password, name, emailAddress, userType
        }

        console.log({ //testing form submission
            firstName: data.get('fname'),
            emailAddress: data.get('email'),
            username: data.get('username'),
            userType: userType
        });

        //TODO: verify that username is valid
        //const verUser = USER_REGEX.test(data.get('username'));
        //TODO: verify that password is valid
        //const verPwd = PWD_REGEX.test(data.get('password'));
        //verify that password is equal to confirm password
        const verMatch = data.get('password') === data.get('confirm_password');

        // if(!verUser){
        //     console.log("invalid username");
        //     return;
        // }
        // else if(!verPwd){
        //     console.log("invalid password");
        //     return;
        // }
        if(!verMatch) {
            console.log("passwords do not match");
            //TODO: notify user that passwords do not Match
            console.log(verMatch);
            return;
        }


        axios.post("http://localhost:8080/api/register", user) // for local testing
        //axios.post("http://34.16.169.60:8080/api/register", user)
            .then((res) => {
                if(res.status === 200) {
                    console.log('No Existing User! User is now registered!')
                    //TODO: Redirect
                    if (res.data.userType.includes("student")) {

                        //temporary fix
                        var params = new URLSearchParams();
                        params.append("username", data.get("username"));
                        console.log("going to /studentLanding?" + params.toString())
                        location.href = "/studentLanding?" + params.toString();

                    } else if (res.data.userType.includes("tutor")) {
                        var params = new URLSearchParams();
                        params.append("username", data.get("username"));
                        console.log("going to /tutorLanding?" + params.toString())
                        location.href = "/tutorLanding?" + params.toString();

                    } else if (res.status === 409) { //if username + email already exists
                        console.log('Username or email already exists!');
                    }
                }
            })
            .catch((err) => {
                console.log("something is wrong");
                console.log(err.value);
            });
    };



    // registration page information
    //note: get list of schools from database later
    const schools =[
        {
            value: '',
            label: 'select a school',
        },
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
              <InputLabel id="schoolLabel">School</InputLabel>
              <Select defaultValue="" labelId="schoolLabel" id="school" name="school" label="School" sx={{
                  m: 1, minWidth: 225
              }}>
                  {schools.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                          {option.label}
                      </MenuItem>
                  ))}
              </Select> <br/>
              <TextField autoComplete="given-name" id="fname" name="fname" label="First Name"
                         onChange={(e) => setName(e.target.value)}/><br/>
              <TextField autoComplete="last-name" id="lname" name="lname" label="Last Name"/><br/>
              <TextField autoComplete="email" id="email" name="email" label="Email"
                         onChange={(e) => setEmail(e.target.value)}/><br/>
              <TextField id="username" name="username" label="Username"
                         onChange={(e) => setUsername(e.target.value)}/><br/>
              <TextField autoComplete="new-password" type="password" id="password" name="password"
                         label="Password" onChange={(e) => setPassword(e.target.value)}/><br/>
              <TextField id="confirm_password" type="password" name="confirm_password"
                         label="Confirm Password"/><br/>
              <FormLabel htmlFor="user_type">Are you a:</FormLabel>

              <RadioGroup id="user_type" row onChange={(e) => setType(e.target.value)}>
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
