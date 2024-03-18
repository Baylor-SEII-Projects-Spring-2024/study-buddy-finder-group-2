import React, {useState} from 'react';
import axios from "axios";

import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";


function SearchUsersPage() {
    const [username, setUsername] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [emailAddress, setEmail] = useState(null);
    const [userType, setType] = useState(null);
    const [school, setSchool] = useState(null);

    const [searchStr, setStr] = useState(null);

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleSubmit = (event) => {
        // prevents page reload
        event.preventDefault();

        const user = {
            username, firstName, lastName, emailAddress, userType, school
        }

        // TODO: set error for empty search
        //axios.post("http://localhost:8080/api/searchUsers", user) // for local testing
        axios.post("http://34.16.169.60:8080/api/searchUsers", user)
            .then((res) => {
                console.log(user.firstName)
                console.log(user.lastName)

                if(res.status === 200){
                    console.log(res.data[0])
                    setUsers(res.data);
                    //fetchUsers(searchStr);
                }
            })
            .catch((err) => {
                console.log(err.value);
            });
    }

    // TODO: add connections
    // use this to close the profile view as well??
    /*const handleAddConnection = (event) => {
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
    }*/

    //DIALOG 2 (Add connection)
    const [openProfile, setOpenProfile] = React.useState(false);

    // takes in selected user to display profile
    const handleClickOpenProfile = (user) => {
        setSelectedUser(user);

        // set state variables to the currently selected user
        setUsername(user.username);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.emailAddress);
        setType(user.userType);
        setSchool(user.school);

        setOpenProfile(true);
    };

    // close the profile
    const handleCloseProfile = () => {
        setOpenProfile(false);

        // must reset user values for continued search!!
        setUsername(searchStr);
        setFirstName(searchStr);
        setLastName(searchStr);
        setEmail(null);
        setType(null);
        setSchool(null);
    };

    // get the string the to search with
    const handleSearch = (str) => {
        setStr(str);

        setFirstName(str);
        setLastName(str);
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

                {/* this is the search area, submits a form */}
                <Box component="form" noValidate onSubmit={handleSubmit}
                     sx={{ paddingTop: 3, width: 550, margin: 'auto' }}>
                    <Stack spacing={4} direction="row" justifyContent="center">
                        {/* get search string for name and username */}
                        <TextField
                            required
                            id="search"
                            name="search"
                            label="Name or Username"
                            variant="outlined"
                            onChange={(e) => handleSearch(e.target.value)}
                        />

                        {/* get requested user type (none, student, tutor) */}
                        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel required id="userType">User Type</InputLabel>
                            <Select
                                labelId="select userType"
                                id="select userType"
                                label="userType"
                                onChange={(e) => setType(e.target.value)}
                            >
                                <MenuItem value={null}>
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={"student"}>Student</MenuItem>
                                <MenuItem value={"tutor"}>Tutor</MenuItem>
                            </Select>
                        </FormControl>

                        {/* submit the search form to get results */}
                        <Button
                            variant='contained'
                            color="primary"
                            type="submit"
                        >
                            Search</Button>
                    </Stack>
                </Box>

                {/* display all matches on separate cards */}
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
                                                <strong>Name: </strong> {user.firstName + " " + user.lastName}
                                                <br />
                                            </li>
                                        </ul>
                                    </Box>

                                    {/* view the profile of that user */}
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

                {/* add button back to user's landing page */}
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
                <DialogTitle variant='s2'>{firstName + " " + lastName}'s Profile</DialogTitle>
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
                        //onSubmit={handleAddConnection}
                    >
                        Connect</Button>
                </DialogActions>
            </Dialog>
            =        </div>
    );
}

export default SearchUsersPage;