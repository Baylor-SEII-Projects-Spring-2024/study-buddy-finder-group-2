import React, {useState} from 'react';
import axios from "axios";

import {
    Box,
    Button,
    Card,
    CardContent, Dialog, DialogActions, DialogContent, DialogTitle,
    Stack,
    TextField,
    Typography
} from "@mui/material";


function ConnectionsPage() {
    const [username, setUsername] = useState(null);
    //const [firstName, setFirstName] = useState(null);
    //const [lastName, setLastName] = useState(null);
    const [name, setName] = useState(null);
    const [emailAddress, setEmail] = useState(null);
    const [userType, setType] = useState(null);
    const [school, setSchool] = useState(null);

    const [users, setUsers] = useState([]);
    const [searchStr, setSearchStr] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleSubmit = (event) => {
        // prevents page reload
        event.preventDefault();

        const user = {
            username, name, emailAddress, userType, school
        }

        const searchWord = {
            searchStr
        }

    }

    const handleAddConnection = (event) => {
        // prevents page reload
        event.preventDefault();

        const user = {
            username, name
        }

        //axios.post(`http://localhost:8080/api/searchUsers/addConnection/${username}`, selectedUser) // for local testing
            axios.post("http://34.16.169.60:8080/viewMeetups", meeting)
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

    const handleClickOpenProfile = (user) => {
        setSelectedUser(user);

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

    return (
        <div>
            <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
                <Card sx={{ width: 300, margin: 'auto' }} elevation={4}>
                    <CardContent>
                        <Typography variant='h4' align='center'>Search Users</Typography>
                    </CardContent>
                </ Card>

                <Box component="form" noValidate onSubmit={handleSubmit}
                     sx={{ paddingTop: 3, width: 400, margin: 'auto' }}>
                    <Stack spacing={4} direction="row" justifyContent="center">
                        <TextField
                            required
                            id="search"
                            name="search"
                            label="Search Here"
                            variant="outlined"
                            onChange={(e) => setSearchStr(e.target.value)}
                        />

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
                          sx={{ width: 500, margin: 'auto', marginTop: 1, cursor: 'pointer'}}
                          elevation={6} onClick={() => handleClickOpenProfile(user)}>
                        <CardContent>
                            <ul style={{ listStyleType: 'none', padding: 0, margin: 0}}>
                                <li>
                                    <strong>Username: </strong> {user.username}
                                    <br />
                                    <strong>Name: </strong> {user.name}
                                    <br />
                                </li>
                            </ul>
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
                fullWidth="md"
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