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
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/navigation";


function RegistrationPage() {
    const router = useRouter();
    const token = useSelector(state => state.authorization.token); //get current state
    const dispatch = useDispatch(); // use to change state

    // Database looks for attribute name, not column name when assigning attributes to new row
    // emailAddress and userType need no underscores
    const [username, setUsername] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [emailAddress, setEmail] = useState(null);
    const [userType, setType] = useState(null);
    const [school, setSchool] = useState(null);
    const [schools, setSchools] = useState(null);

    //errors
    const [errUser, setErrUser] = useState(false);
    const [errPwd, setErrPwd] = useState(false);
    const [errFirstName, setErrFirstName] = useState(false);
    const [errLastName, setErrLastName] = useState(false);
    const [errEmail, setErrEmail] = useState(false);
    const [errCPwd, setErrCPwd] = useState(false);
    const [errSchool, setErrSchool] = useState(false);
    const [errUserType, setErrUserType] = useState(false);

    const api = axios.create({
        baseURL: 'http://localhost:8080/'
        //baseURL: 'http://34.16.169.60:8080/'
    });


    //getting list of schools from database
    useEffect(() => {

        api.get("api/request-school-options")
            .then((result) => {
                console.log(result.data);
                setSchools(result.data);
            })
            .catch(error => console.log(error)); // for local testing

    }, []);

    //password and username validationregex
    const PWD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^*-]).{8,}$/;
    //username regex
    const USER_REGEX = /^[A-z,0-9]{3,23}$/;
    // handles submission of form

    const submitInfo = (event) => {
        let right = true;
        //TODO: verify that username is valid
        console.log(USER_REGEX.test(username));
        const verUser = USER_REGEX.test(username) && username !== null;
        //TODO: verify that password is valid
        const verPwd = PWD_REGEX.test(password) && password !== null;
        console.log(PWD_REGEX.test(password));
        console.log(verPwd);
        //verify that password is equal to confirm password
        const verMatch = password === confirmPassword;


        setErrFirstName(firstName == null || firstName === '');
        setErrLastName(lastName === null || lastName === '');
        setErrSchool(school === null);
        setErrEmail(emailAddress === null || emailAddress === '');
        if (school !== null && emailAddress !== null && emailAddress !== '') {
            console.log(emailAddress.substring(emailAddress.length - school.emailDomain.length, emailAddress.length));
            setErrEmail(emailAddress.length < school.emailDomain.length && emailAddress.substring(emailAddress.length - school.emailDomain.length, emailAddress.length) !== school.emailDomain);
        }
        setErrUserType(userType === null);
        setErrUser(!verUser);
        setErrPwd(!verPwd);
        setErrCPwd(!verMatch);

        api.get(`api/find-username/${username}`)
            .then(() => {
                setErrUser(false);
            })
            .catch((res) => {
                window.alert("Username already exists! Find a different one");
                setErrUser(true);
                right = false;
            })

        api.get(`api/find-email/${emailAddress}`)
            .then(()=>{
                setErrEmail(false);

            })
            .catch((res) => {
                window.alert("Email already exists!");
                setErrEmail(true);
                right = false;
            })

        if(right){
            handleSubmit();
        }
    }

    const registerUser = () => {
        const user = {
            username, password, firstName, lastName, emailAddress, userType//, school
        }

        console.log({
            firstName: firstName,
            lastName: lastName,
            emailAddress: emailAddress,
            username: username,
            userType: userType,
            school: school,
            password: password
        });

        api.post("api/authorization/register", user)
            .then((res) => {
                console.log('No Existing User! User is now registered!')
                console.log(res.data);

                // can't authorize users right after entered
                // transaction not completed??
                router.push(`/login`);
            })
            .catch((err) => {
                console.log("something is wrong");
            })
    }

    const handleSubmit =  () => {
        //check if fields are valid
        if(errLastName || errFirstName || errSchool || errEmail || errPwd || errCPwd || errUserType || errUser){
            window.alert("Please fill out all fields");
        }
        else {
            registerUser();
        }
    };



    // registration page information
    //note: get list of schools from database later

    return (
        <Box>
            <Box component="form" validate="true"
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
                    isOptionEqualToValue={(option,value) => option.id === value.id}
                    onChange={(e,v) => setSchool(v)}
                    renderOption={(props, option) => (
                        <Box component="li" sx={{ display: 'flex'}} {...props}>
                            {option.schoolName}
                        </Box>
                    )}
                    renderInput={(params) => (
                        <TextField
                            error={errSchool}
                            helperText={errSchool ? 'Please input your school' : ''}
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
                           onChange={(e) => setFirstName(e.target.value)}
                           error={errFirstName} helperText={errFirstName ? 'Please input a first name' : ''}/><br/>
                <TextField autoComplete="last-name" id="lname" name="lname" label="Last Name"
                           onChange={(e) => setLastName(e.target.value)}
                           error={errLastName} helperText={errLastName ? 'Please input a last name' : ''}/><br/>
                <TextField autoComplete="email" id="email" name="email" label="Email"
                           onChange={(e) => setEmail(e.target.value)}
                           error={errEmail} helperText={errEmail ? 'Please input your school email' : ''}/><br/>
                <TextField id="username" name="username" label="Username"
                           onChange={(e) => setUsername(e.target.value)}
                           error={errUser} helperText={errUser ? 'Please input a username of only letters and numbers' : ''}/><br/>
                <TextField autoComplete="new-password" type="password" id="password" name="password"
                           label="Password" onChange={(e) => setPassword(e.target.value)}
                           error={errPwd} helperText={errPwd ? <>
                    Password must have least 8 characters, 1 capital letter, <br/> 1 number,and 1 special character (@.#$!%*?&^) </> : ''}/><br/>
                <TextField id="confirm_password" type="password" name="confirm_password"
                           label="Confirm Password"
                           onChange={(e) => setConfirmPassword(e.target.value)}
                           error={errCPwd} helperText={errCPwd ? 'Please confirm password' : ''}/><br/>
                <FormLabel htmlFor="user_type">Are you a:</FormLabel>

                <RadioGroup id="user_type" row
                            onChange={(e) => setType(e.target.value)}>
                    <FormControlLabel value="student" control={<Radio/>} id="user_student" label="Student"/>
                    <FormControlLabel value="tutor" control={<Radio/>} id="user_tutor" label="Tutor"/>
                </RadioGroup>
                <Box row>
                    <Button id="cancel" variant="outlined" color="error" href="/">Cancel</Button>
                    <Button id="register" variant="contained" onClick={ () => {
                        submitInfo();
                        //handleSubmit();
                    }} >Next</Button>
                </Box>
            </Box>
        </Box>
    );
}

export default RegistrationPage;