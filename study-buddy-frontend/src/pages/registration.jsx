import React, {useEffect, useState} from 'react';
import {Button, RadioGroup, TextField, Box, Grid} from '@mui/material/';
import {
    Autocomplete,
    ButtonGroup,
    FormControlLabel,
    FormLabel,
    InputLabel,
    MenuItem,
    Radio,
    Select,
    Typography
} from "@mui/material";
import axios, {get} from "axios";
import {NextResponse as r} from "next/server";
//import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';


function RegistrationPage() {
    // Database looks for attribute name, not column name when assigning attributes to new row
    // emailAddress and userType need no underscores
    const [username, setUsername] = useState(null);
    const [name, setName] = useState(null);
    const [password, setPassword] = useState(null);
    const [emailAddress, setEmail] = useState(null);
    const [userType, setType] = useState(null);
    const [school, setSchool] = useState(null);
    const [schools, setSchools] = useState(null);



    //TODO: get list of schools from database
    useEffect(() => {
        //axios.get("http://34.16.169.60:8080/api/request-school-options");
        axios.get("http://localhost:8080/api/request-school-options")
            .then((result) => {
                console.log(result.data);
                setSchools(result.data);
    })
            .catch(error => console.log(error)); // for local testing

    }, []);

    //password regex
    const PWD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/g;
    //username regex
    const USER_REGEX = /^\[A-z]{3,23}$/g;
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
        const verUser = USER_REGEX.test(data.get('username'));
        //TODO: verify that password is valid
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
        if(!verMatch) {
            console.log("passwords do not match");
            //TODO: notify user that passwords do not Match
            console.log(verMatch);
            window.alert("passwords do not match");
            return;
        }


        //axios.post("http://localhost:8080/api/register", user) // for local testing
        axios.post("http://34.16.169.60:8080/api/register", user)
            .then((res) => {
                if(res.status === 200) {
                    console.log('No Existing User! User is now registered!')
                    //TODO: Redirect
                    if (res.data.userType.includes("student")) {

                        //console.log(res.data);
                        //temporary fix
                        var params = new URLSearchParams();
                        params.append("userid", data.get("username").toString());
                        console.log("going to /studentLanding?" + params.toString())
                        location.href = "/studentLanding?" + params.toString();

                    } else if (res.data.userType.includes("tutor")) {
                        var params = new URLSearchParams();
                        params.append("username", data.get("username"));
                        console.log("going to /tutorLanding?" + params.toString());
                        location.href = "/tutorLanding?" + params.toString();
                    }
                }
                else if(res.status === 409){ //if username + email already exists
                    console.log('Username or email already exists!');
                    window.alert("Username or email already exists!")

                }
            })
            .catch((err) => {
                console.log("something is wrong");
                console.log(err.value);
                window.alert("something is wrong");
            })
    };



    // registration page information
    //note: get list of schools from database later

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

              <Autocomplete // school selector
                  id="school-select"
                  options={schools}
                  sx={{ width: 200}}
                  autoHighlight
                  getOptionLabel={(option) => option.schoolName}
                  onChange={option => {
                      setSchool(option.id); // setting user's school
                  }}
                  renderOption={(props, option) => (
                      <Box component="li" sx={{ display: 'flex'}} {...props}>
                          {option.schoolName}
                      </Box>
                  )}
                  renderInput={(params) => (
                      <TextField
                          {...params}
                          label="Choose a School"
                          inputProps={{
                              ...params.inputProps,
                              autoComplete: 'new-password', // disable autocomplete and autofill
                          }}
                      />
                  )}
              /> <br/>

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
