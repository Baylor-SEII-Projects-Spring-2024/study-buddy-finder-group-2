import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControl, InputLabel, MenuItem, Select,
    Stack, TextField,
    Typography
} from "@mui/material";
import axios from "axios";

function InvitationsPage() {
    const [thisUser, setThisUser] = useState(null);
    const [requestType, setRequestType] = useState(null);

    const [username, setUsername] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [emailAddress, setEmail] = useState(null);
    const [userType, setType] = useState(null);
    const [school, setSchool] = useState(null);

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const [id, setId] = useState(null);
    const [requester, setRequester] = useState(null);
    const [requested, setRequested] = useState(null);
    const [isConnected, setIsConnected] = useState(null);
    const [selectedConnection, setSelectedConnection] = useState(null);

    // get the user's username
    // show all connections for that user
    useEffect(() => {
        const params = new URLSearchParams(window.location.search),
            user = params.get("username");

        setThisUser(user);
        fetchInRequests(user);
    }, [])

    // get all connections with isConnected = false
    const fetchInRequests = (user) => {
        console.log("User to fetch for: " + user);

        //fetch(`http://localhost:8080/api/viewInRequests/${user}`) // use this for local development
        fetch(`http://34.16.169.60:8080/api/viewInRequests/${user}`)
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching connections:', error));
    };

    // get all connections with isConnected = false
    const fetchOutRequests = (user) => {
        console.log("User to fetch for: " + user);

        //fetch(`http://localhost:8080/api/viewOutRequests/${user}`) // use this for local development
        fetch(`http://34.16.169.60:8080/api/viewOutRequests/${user}`)
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching connections:', error));
    };

    const [openProfile, setOpenProfile] = React.useState(false);
    const [text, setText] = useState("Connect");

    // get incoming or outgoing requests
    const handleSubmit = (event) => {
        // prevents page reload
        event.preventDefault();

        // outgoing
        if(requestType === "incoming") {
            setText("Connect");
            fetchInRequests(thisUser);
        }
        // incoming
        else if(requestType === "outgoing") {
            setText("Pending");
            fetchOutRequests(thisUser);
        }
        else {
            console.log("error with request type?!");
        }
    }

    // add connection
    // TODO: cancel requests instead of nothing for pending??

    const handleConnection = (event) => {
        // prevents page reload
        event.preventDefault();

        const connection = {
            requester, requested, isConnected
        }

        // if the user isn't the requester
        if(text === "Connect") {
            console.log(connection);
            setIsConnected(true);

            //axios.post("http://localhost:8080/api/viewRequests/addConnection", connection) // for local testing
            axios.post(`http://34.16.169.60:8080/api/viewRequests/addConnection`, connection)
                .then((res) => {
                    console.log("CONNECTION ADDED.");
                    if(res.status === 200) {
                        handleCloseProfile();
                        fetchInRequests();
                    }
                })
                .catch((err) => {
                    console.log("ERROR ADDING CONNECTION.");
                    console.log(err);
                });
        }
    }

    // show the profile of the connected user
    const handleClickOpenProfile = (user) => {
        setSelectedUser(user);

        // set state variables to the currently selected user
        setUsername(user.username);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.emailAddress);
        setType(user.userType);
        setSchool(user.school);

        // set connection values for existing connection
        //axios.post(`http://localhost:8080/api/viewRequests/getConnection/${thisUser}`, user.username)
        axios.post(`http://34.16.169.60:8080/api/viewRequests/getConnection/${thisUser}`, user.username)
            .then((res) => {
                setSelectedConnection(res.data);

                setRequester(res.data.requester);
                setRequested(res.data.requested);
                setIsConnected(res.data.isConnected);
                setId(res.data.id);
            })
            .catch((err) => {
                console.error('Error getting connection:', err)
            });

        setOpenProfile(true);
    };

    // close the profile
    // reset user and connection values
    const handleCloseProfile = () => {
        setOpenProfile(false);

        // must reset values for continued search!!
        setUsername(null);
        setFirstName(null);
        setLastName(null);
        setEmail(null);
        setType(null);
        setSchool(null);

        setSelectedConnection(null);
        setRequested(null);
        setRequester(null);
        setIsConnected(false);

        setText("Connect");
    };

    return (
        <div>
            <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
                <Card sx={{ width: 520, margin: 'auto' }} elevation={4}>
                    <CardContent>
                        <Typography variant='h4' align='center'>Your Requests</Typography>
                    </CardContent>
                </ Card>

                {/* this is the search area, submits a form */}
                <Box component="form" noValidate onSubmit={handleSubmit}
                     sx={{ paddingTop: 3, width: 550, margin: 'auto' }}>
                    <Stack spacing={4} direction="row" justifyContent="center">
                        {/* get requested user type (none, student, tutor) */}
                        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel required id="requestType">Request Type</InputLabel>
                            <Select
                                labelId="select requestType"
                                id="select requestType"
                                label="requestType"
                                onChange={(e) => setRequestType(e.target.value)}
                            >
                                <MenuItem value={"incoming"}>Incoming</MenuItem>
                                <MenuItem value={"outgoing"}>Outgoing</MenuItem>
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
                onSubmit={handleConnection}
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
                        Back</Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: isConnected ? '#9c27b0' : 'light blue',
                            '&:hover': {
                                backgroundColor: isConnected ? '#6d1b7b' : 'light blue'
                            },
                        }}
                        type="submit"
                    >
                        {text}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default InvitationsPage;
