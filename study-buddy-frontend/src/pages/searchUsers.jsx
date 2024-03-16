import React, {useState} from 'react';
import axios from "axios";

import {
    Box,
    Button,
    Card,
    CardContent, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, List, Radio, RadioGroup,
    Stack,
    TextField,
    Typography
} from "@mui/material";


function SearchUsersPage() {
    const [username, setUsername] = useState(null);
    //const [firstName, setFirstName] = useState(null);
    //const [lastName, setLastName] = useState(null);
    const [name, setName] = useState(null);
    const [emailAddress, setEmail] = useState(null);
    const [userType, setType] = useState(null);
    const [school, setSchool] = useState(null);

    const [users, setUsers] = useState([]);
    //const [searchStr, setSearchStr] = useState(null);
    //const [searchType, setSearchType] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleSubmit = (event) => {
        // prevents page reload
        event.preventDefault();

        const user = {
            username, name, emailAddress, userType, school
        }

        console.log(user.userType);

        // TODO: set error for empty search
        axios.post('http://localhost:8080/api/searchUsers', user) // for local testing
        //axios.post("http://34.16.169.60:8080/viewMeetups", meeting)
            .then((res) => {
                if(res.status === 200){
                    setUsers(res.data);
                    //fetchUsers(searchStr);
                }
            })
            .catch((err) => {
                console.log(err.value);
            });
    }

    const handleAddConnection = (event) => {
        // prevents page reload
        event.preventDefault();

        const user = {
            username, name
        }

        axios.post(`http://localhost:8080/api/searchUsers/addConnection/${username}`, selectedUser) // for local testing
            //axios.post("http://34.16.169.60:8080/viewMeetups", meeting)
            .then((res) => {
                if(res.status === 200) {
                    handleCloseProfile();
                }
            })
            .catch((err) => {
                console.log("ERROR ADDING CONNECTION.");
                console.log(err.value);
            });
    }

    //DIALOG 2 (Add connection)
    const [openProfile, setOpenProfile] = React.useState(false);

    // takes in selected meeting to display content of that meeting
    const handleClickOpenProfile = (user) => {
        setSelectedUser(user);

        // set state variables to the currently selected meeting
        setUsername(user.username);
        setName(user.name);
        setEmail(user.emailAddress);
        setType(user.userType);
        setSchool(user.school);

        setOpenProfile(true);
    };

    const handleCloseProfile = () => {
        setOpenProfile(false);
    };

    const handleSearch = (str) => {
        setName(str);
        setUsername(str);
    };

    return (
        <div>
            <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
                <Card sx={{ width: 520, margin: 'auto' }} elevation={4}>
                    <CardContent>
                        <Typography variant='h4' align='center'>Search Users</Typography>
                    </CardContent>
                </ Card>

                <Box component="form" noValidate onSubmit={handleSubmit}
                     sx={{ paddingTop: 3, width: 550, margin: 'auto' }}>
                    <Stack spacing={4} direction="row" justifyContent="center">
                        <TextField
                            required
                            id="search"
                            name="search"
                            label="Name or Username"
                            variant="outlined"
                            onChange={(e) => handleSearch(e.target.value)}
                        />

                        <RadioGroup id="user_type" row
                                    onChange={(e) => setType(e.target.value)}>
                            <FormControlLabel value="student" control={<Radio/>} id="user_student" label="Student"/>
                            <FormControlLabel value="tutor" control={<Radio/>} id="user_tutor" label="Tutor"/>
                        </RadioGroup>

                        <Button
                            variant='contained'
                            color="primary"
                            type="submit"
                        >
                            Search</Button>
                    </Stack>
                </Box>

                {users.map((user, index) => (
                    <Card key={index}
                          sx={{ width: 520, margin: 'auto', marginTop: 1, cursor: 'pointer' }}
                          elevation={6}>
                        <CardContent>
                            <Box sx={{ paddingTop: 3, width: 400, margin: 'auto' }}>
                                <Stack spacing={13} direction="row" justifyContent="space-evenly">
                                    <Box sx={{ width: 200 }}>
                                        <ul style={{ listStyleType: 'none', padding: 0, margin: 0}}>
                                            <li>
                                                <strong>Username: </strong> {user.username}
                                                <br />
                                                <strong>Name: </strong> {user.name}
                                                <br />
                                            </li>
                                        </ul>
                                    </Box>

                                    <Button
                                        variant='contained'
                                        color="primary"
                                        size="small"
                                        onClick={() => handleClickOpenProfile(user)}
                                    >
                                        View Profile</Button>
                                </Stack>
                            </Box>
                        </CardContent>
                    </Card>
                ))}

                {/*<Button
                    variant="outlined"
                    color="error"
                    href="/"
                >
                    Back</Button>*/}

            </Stack>

            {/*View user profile and add as connection*/}
            <Dialog
                open={openProfile}
                onClose={handleCloseProfile}
                fullWidth
                component="form"
                validate="true"
            >
                <DialogTitle variant='s2'>{name}'s Profile</DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                        <Typography variant='s2'>{userType}</Typography>
                        <Typography variant='s2'></Typography>
                        <Typography variant='s1'>Username: {username}</Typography>
                        <Typography variant='s1'>Email: {emailAddress}</Typography>
                        <Typography variant='s1'>School: {school}</Typography>
                        <Typography variant='s1'>Courses...</Typography>
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleCloseProfile}
                    >
                        Cancel</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        onSubmit={handleAddConnection}
                    >
                        Connect</Button>
                </DialogActions>
            </Dialog>
=        </div>
    );
}

export default SearchUsersPage;
