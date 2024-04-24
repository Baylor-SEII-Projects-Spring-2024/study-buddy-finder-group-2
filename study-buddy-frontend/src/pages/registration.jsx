import React, {useEffect, useState} from 'react';
import {Button, RadioGroup, TextField, Box, Grid} from '@mui/material/';
import { LinearProgress } from '@mui/material';
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

const api = axios.create({
    baseURL: 'http://localhost:8080/'
    //baseURL: 'http://34.16.169.60:8080/'
});

const evaluatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
};

function RegistrationPage() {
    const router = useRouter();
    const token = useSelector(state => state.authorization.token); //get current state
    const dispatch = useDispatch(); // use to change state

    // Database looks for attribute name, not column name when assigning attributes to new row
    // emailAddress and userType need no underscores
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailAddress, setEmail] = useState("");
    const [userType, setType] = useState(null);
    const [school, setSchool] = useState(null);
    const [schools, setSchools] = useState([]);

    //errors
    const [errUser, setErrUser] = useState("");
    const [errPwd, setErrPwd] = useState("");
    const [errFirstName, setErrFirstName] = useState("");
    const [errLastName, setErrLastName] = useState("");
    const [errEmail, setErrEmail] = useState("");
    const [errCPwd, setErrCPwd] = useState("");
    const [errSchool, setErrSchool] = useState("");
    const [errUserType, setErrUserType] = useState("");

    const [passwordStrength, setPasswordStrength] = useState(0);


    //getting list of schools from database
    useEffect(() => {
        api.get("api/request-school-options")
            .then((result) => {
                console.log(result.data);
                setSchools(result.data);
            })
            .catch(error => console.log(error)); // for local testing

    }, []);

    const handleChangeUserType = (event) => {
        const newUserType = event.target.value;
        setType(newUserType);
        if (!newUserType) {
            setErrUserType("Please select a user type.");  // Set an error if no user type is selected
        } else {
            setErrUserType("");
        }
    };

    const handleChangeSchool = (event, newValue) => {
        if (newValue) {
            setSchool(newValue);
            setErrSchool("");
        } else {
            setSchool(null);
            setErrSchool("Please select a school.");
        }
    };
    const handleChangePassword = (event) => {
        const newPassword = event.target.value;
        setPassword(newPassword);
        const strength = evaluatePasswordStrength(newPassword);
        setPasswordStrength(strength);
        if (strength < 3) {
            setErrPwd("Password is too weak. Strong passwords contain at least 8 characters, 1 capital letter, 1 number, and 1 special character (@.#$!%*?&^)");
        } else {
            setErrPwd("");
        }
    };

    const handleChangeConfirmPassword = (event) => {
        const newPassword = event.target.value;
        setConfirmPassword(newPassword);
        if ( newPassword !== password ) {
            setErrCPwd("Passwords do not match");
        } else {
            setErrCPwd("");
        }
    };

    const handleChangeFirstName = (event) => {
        const value = event.target.value
        setFirstName(value);
        if (value === '') {
            setErrFirstName("Please input a first name");
        } else {
            setErrFirstName("");
        }
    };

    const handleChangeLastName = (event) => {
        const value = event.target.value
        setLastName(value);
        if (value === '') {
            setErrLastName("Please input a last name");
        } else {
            setErrLastName("");
        }
    };

    const handleChangeUsername = (event) => {
        const newUsername = event.target.value;
        setUsername(newUsername);
        if (newUsername === '') {
            setErrUser("Please input a username");
        }
        else {
            api.get(`api/find-username/${newUsername}`)
                .then(() => {
                    setErrUser("");
                })
                .catch((res) => {
                    setErrUser("Username already exists. Please choose another.");
                })
        }
    }

    const handleChangeEmail = (event) => {
        const newEmail = event.target.value;
        setEmail(newEmail);
        if (newEmail === '') {
            setErrEmail("Please input an email");
        } else if(school && emailAddress.length < school.emailDomain.length &&
            emailAddress.substring(
                emailAddress.length - school.emailDomain.length, emailAddress.length) !== school.emailDomain) {
            setErrEmail("Email is not a school email. Try again.");
        }
        else {
            api.get(`api/find-email/${newEmail}`)
                .then(() => {
                    setErrEmail("");
                })
                .catch((error) => {
                    if (error.response && error.response.status === 400) {
                        setErrEmail("Email already exists!");
                    } else {
                        console.log("Something went wrong", error);
                        setErrEmail("Failed to validate email. Try again.");
                    }
                });
        }
    };

    const submitInfo = (event) => {

        // check if fields are empty first
        if (firstName === '' || lastName === '' || emailAddress === '' || username === '' || password === '' || confirmPassword === '' || userType === null || school === null) {
            alert("Please fill out all fields");
            return;
        }

        if (errUserType !== "") {
            alert(errUserType);
            return;
        }

        if (errUserType !== "") {
            alert(errUserType);
            return;
        }

        if (errEmail !== "") {
            alert(errEmail);
            return;
        }

        if (errLastName !== "") {
            alert(errLastName);
            return;
        }

        if (errSchool !== "") {
            alert(errSchool);
            return;
        }

        if (errUser !== "") {
            alert(errUser);
            return;
        }

        if (errFirstName !== "") {
            alert(errFirstName);
            return;
        }

        if (errPwd !== "") {
            alert(errPwd);
            return;
        }

        if (errCPwd !== "") {
            alert(errCPwd);
            return;
        }

        registerUser();
    }

    const registerUser = () => {
        const user = {
            username, password, firstName, lastName, emailAddress, userType, school
        }

        console.log({
            firstName: firstName,
            lastName: lastName,
            emailAddress: emailAddress,
            username: username,
            userType: userType,
            password: password,
            school: school
        });


        api.post("api/authorization/register", user)
            .then((res) => {
                console.log('No Existing User! User is now registered!')
                console.log(res.data)
                router.push('/login')
            })
            .catch((err) => {
                console.log("something is wrong");
            })
    }


    const getColor = (strength) => {
        if (strength < 2) return 'error';   // Red
        if (strength < 3) return 'warning'; // Orange
        if (strength < 4) return 'info';    // Yellow
        return 'success';                   // Green
    };


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
                    sx={{width: 200}}
                    autoHighlight
                    getOptionLabel={(option) => option.schoolName}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={handleChangeSchool}
                    renderOption={(props, option) => (
                        <Box component="li" sx={{display: 'flex'}} {...props}>
                            {option.schoolName}
                        </Box>
                    )}
                    renderInput={(params) => (
                        <TextField
                            error={errSchool !== ''}
                            helperText={errSchool !== '' ? errSchool : ''}
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
                           error={errFirstName !== ""}
                           onChange={handleChangeFirstName}
                /><br/>
                <TextField autoComplete="last-name" id="lname" name="lname" label="Last Name"
                           error={errLastName !== ""}
                           onChange={handleChangeLastName}
                /><br/>
                <TextField autoComplete="email" id="email" name="email" label="Email"
                           error={errEmail !== ""}
                           onChange={handleChangeEmail}
                /><br/>
                <TextField id="username" name="username" label="Username"
                           error={errUser !== ""}
                           onChange={handleChangeUsername}
                /><br/>
                <TextField
                    autoComplete="new-password"
                    type="password"
                    id="password"
                    name="password"
                    label="Password"
                    error={errPwd !== ""}
                    onChange={handleChangePassword}
                    fullWidth
                    sx={{marginBottom: 1, width: '14%'}} // Set the width of the TextField to 75%
                />
                <br/>
                {password && (
                    <Box sx={{width: '13.5%', mb: 2}}>
                        <LinearProgress
                            variant="determinate"
                            value={(passwordStrength / 4) * 100}
                            color={getColor(passwordStrength)}
                            sx={{height: 10}}
                        />
                    </Box>
                )}
                <TextField
                    id="confirm_password"
                    type="password"
                    name="confirm_password"
                    label="Confirm Password"
                    error={errCPwd !== ""}
                    onChange={handleChangeConfirmPassword}
                    fullWidth
                    sx={{width: '14%'}}
                />
                <br/>

                <FormLabel htmlFor="user_type">Are you a:</FormLabel>

                <RadioGroup id="user_type" row onChange={handleChangeUserType} value={userType}>
                    <FormControlLabel value="student" control={<Radio/>} label="Student"/>
                    <FormControlLabel value="tutor" control={<Radio/>} label="Tutor"/>
                </RadioGroup>
                <Box>
                    <Button id="cancel" variant="outlined" color="error" href="/">Cancel</Button>
                    <Button id="register" variant="contained" onClick={() => {
                        submitInfo();
                    }}>Next</Button>
                </Box>
            </Box>
        </Box>
    );
}

export default RegistrationPage;