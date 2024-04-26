import React, {useCallback, useEffect, useState} from 'react';
import {Button, RadioGroup, TextField, Box} from '@mui/material/';
import { LinearProgress } from '@mui/material';
import {
    Autocomplete,
    FormControlLabel,
    FormLabel,
    Radio,
    Typography
} from "@mui/material";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/navigation";
import Particles from "react-tsparticles";
import { loadFull } from 'tsparticles';

const api = axios.create({
    baseURL: 'http://localhost:8080/',
    //baseURL: 'http://34.16.169.60:8080/',
});

const evaluatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return Math.min(strength, 4);
};

const passwordStrengthColors = {
    0: 'linear-gradient(to right, #ffcccc, #ff6666)',
    1: 'linear-gradient(to right, #ff6666, #ffcc66)',
    2: 'linear-gradient(to right, #ffcc66, #ccff66)',
    3: 'linear-gradient(to right, #ccff66, #66cc66)',
    4: 'linear-gradient(to right, #66cc66, #006400)'
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
    const [borderStyle, setBorderStyle] = useState('3px solid #A9A9A9; border-radius: 20px;');
    const [isPasswordEntered, setIsPasswordEntered] = useState(false);

    useEffect(() => {
        if (passwordStrengthColors[passwordStrength]) {
            setBorderStyle(`3px solid transparent; border-image: ${passwordStrengthColors[passwordStrength]} 1 stretch; border-radius: 20px;`);
        }
    }, [passwordStrength]);

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
            setErrUserType("Please select a user type.");
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
        if (newPassword === '') {
            setIsPasswordEntered(false);
        } else {
            setIsPasswordEntered(true);
        }
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
        if (strength < 2) return 'error';
        if (strength < 3) return 'warning';
        if (strength < 4) return 'info';
        return 'success';
    };

    const colorByStrength = (strength) => {
        switch (strength) {
            case 1:
                return ['#ffcccc', '#ff6666', '#ff4d4d'];
            case 2:
                return ['#ffeb99', '#ffcc66', '#ffbf00'];
            case 3:
                return ['#d9f2d9', '#ccff66', '#b3ff66'];
            case 4:
                return ['#66cc66', '#33cc33', '#009900'];
            default:
                return ["#006400", "#2F4F4F", "#228B22", "#B8860B", "#DAA520", "#FFD700"];
        }
    };

    const particlesInit = useCallback(async (engine) => {
        await loadFull(engine);
    }, []);

    const particlesLoaded = useCallback(async (container) => {
        console.log('Particles Loaded');
    }, []);

    return (
        <Box sx={{
            position: 'relative',
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
        }}>
            <Particles
                id="tsparticles"
                init={particlesInit}
                loaded={particlesLoaded}
                options={{
                    fullScreen: { enable: true, zIndex: -1 },
                    particles: {
                        number: {
                            value: 100,
                        },
                        color: {
                            value: colorByStrength(passwordStrength),
                        },
                        shape: {
                            type: "circle",
                        },
                        opacity: {
                            value: { min: 0.3, max: 0.5 },
                        },
                        size: {
                            value: { min: 1, max: 5 },
                        },
                        links: {
                            enable: true,
                            distance: 150,
                            color: "#aaaaa",
                            opacity: 0.4,
                            width: 1,
                        },
                        move: {
                            enable: true,
                            speed: 2,
                            direction: "none",
                        }
                    },
                    interactivity: {
                        events: {
                            onHover: {
                                enable: true,
                                mode: "repulse"
                            },
                            onClick: {
                                enable: true,
                                mode: "push"
                            },
                        }
                    },
                    detectRetina: true
                }}
            />
            <Box component="form" validate="true" sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '400px',
                minWidth: '400px',
                maxWidth: '400px',
                height: '600px',
                minHeight: '600px',
                maxHeight: '600px',
                overflowY: 'auto',
                padding: 4,
                backgroundColor: '#fff',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 2,
                border: isPasswordEntered ? borderStyle : '3px solid #A9A9A9; border-radius: 20px;',
                transition: 'border 1s ease-in-out, border-image 1s ease-in-out',
            }}>
                <Typography component="h1" variant="h5">Register</Typography><br/>
                <Autocomplete
                    id="school-select"
                    options={schools}
                    sx={{ width: '100%', mb: 2 }}
                    autoHighlight
                    getOptionLabel={(option) => option.schoolName}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={handleChangeSchool}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Choose a School"
                            error={errSchool !== ''}
                            helperText={errSchool !== '' ? errSchool : ''}
                            fullWidth
                            autoComplete='off'
                        />
                    )}
                />

                <TextField
                    label="First Name"
                    autoComplete="given-name"
                    id="fname"
                    name="fname"
                    fullWidth
                    error={errFirstName !== ""}
                    helperText={errFirstName !== "" ? errFirstName : ""}
                    onChange={handleChangeFirstName}
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Last Name"
                    autoComplete="last-name"
                    id="lname"
                    name="lname"
                    fullWidth
                    error={errLastName !== ""}
                    helperText={errLastName !== "" ? errLastName : ""}
                    onChange={handleChangeLastName}
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Email"
                    autoComplete="email"
                    id="email"
                    name="email"
                    fullWidth
                    error={errEmail !== ""}
                    helperText={errEmail !== "" ? errEmail : ""}
                    onChange={handleChangeEmail}
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Username"
                    id="username"
                    name="username"
                    fullWidth
                    error={errUser !== ""}
                    helperText={errUser !== "" ? errUser : ""}
                    onChange={handleChangeUsername}
                    sx={{ mb: 2 }}
                />

                <TextField
                    type="password"
                    label="Password"
                    id="password"
                    name="password"
                    fullWidth
                    error={errPwd !== ""}
                    onChange={handleChangePassword}
                    sx={{ mb: 1 }}
                />

                {password && (
                    <Box sx={{ width: '100%', mb: 2, transition: 'width 0.5s ease-in-out' }}>
                        <LinearProgress
                            variant="determinate"
                            value={(passwordStrength / 4) * 100}
                            color={getColor(passwordStrength)}
                            sx={{ width: '100%', height: 10 }}
                        />
                        <Typography sx={{ textAlign: 'center', mt: 1 }}>
                            Password Strength: {['Weak', 'Fair', 'Good', 'Strong'][passwordStrength - 1]}
                        </Typography>
                    </Box>
                )}

                <TextField
                    type="password"
                    label="Confirm Password"
                    id="confirm_password"
                    name="confirm_password"
                    fullWidth
                    error={errCPwd !== ""}
                    helperText={errCPwd !== "" ? errCPwd : ""}
                    onChange={handleChangeConfirmPassword}
                    sx={{ mb: 2 }}
                />

                <FormLabel htmlFor="user_type" sx={{ mb: 1 }}>Are you a:</FormLabel>
                <RadioGroup
                    id="user_type"
                    row
                    onChange={handleChangeUserType}
                    value={userType}
                    sx={{ mb: 3 }}
                >
                    <FormControlLabel value="student" control={<Radio />} label="Student" />
                    <FormControlLabel value="tutor" control={<Radio />} label="Tutor" />
                </RadioGroup>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Button variant="outlined" color="error" href="/">Cancel</Button>
                    <Button variant="contained" onClick={() => submitInfo()}>Next</Button>
                </Box>

            </Box>
        </Box>

    );
}

export default RegistrationPage;