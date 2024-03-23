import React, {useEffect, useState} from 'react';
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


function SearchUsersPage() {
    const [actualUser, setUser] = useState(null);
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

    const [requester, setRequester] = useState(null);
    const [requested, setRequested] = useState(null);
    const [isConnected, setIsConnected] = useState(null);

    // get the user's username
    useEffect(() => {
        const params = new URLSearchParams(window.location.search),
            user = params.get("username");

        setRequester(user);
    }, [])

    const handleSubmit = (event) => {
        // prevents page reload
        event.preventDefault();

        const user = {
            username, name, emailAddress, userType, school
        }

        const searchWord = {
            searchStr
        }

        // TODO: set error for empty search
        //Question: do we need error for empty search?
        axios.post('http://localhost:8080/api/searchUsers', searchWord.searchStr) // for local testing
            .then((res) => {
                console.log("entered");

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

        const connection = {
            requester, requested, isConnected
        }
        console.log(connection.requester);
        console.log(connection.requested);

        //axios.post("http://localhost:8080/api/searchUsers/addConnection", connection) // for local testing
        axios.post("http://34.16.169.60:8080/api/searchUsers/addConnection", connection)
            .then((res) => {
                console.log("CONNECTION ADDED.");
                if(res.status === 200) {
                    handleCloseProfile();
                }
            })
            .catch((err) => {
                console.log("ERROR ADDING CONNECTION.");
                console.log(err.value);
            });
    }

    const handleSetConnection = () => {
        setRequested(selectedUser.username);
        setIsConnected(false);
    }

    //DIALOG (Add connection)
    const [openProfile, setOpenProfile] = React.useState(false);

    // takes in selected meeting to display content of that meeting
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
                onSubmit={handleAddConnection}
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

                    >
                        Connect</Button>
                </DialogActions>
            </Dialog>
    );
}

export default SearchUsersPage;