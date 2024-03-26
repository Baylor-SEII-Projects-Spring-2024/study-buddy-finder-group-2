import React, {useEffect, useState} from 'react';
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
    const [actualUser, setUser] = useState(null);
    const [username, setUsername] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [emailAddress, setEmail] = useState(null);
    const [userType, setType] = useState(null);
    const [school, setSchool] = useState(null);

    const [searchStr, setStr] = useState(null);

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const [requester, setRequester] = useState(null);
    const [requested, setRequested] = useState(null);
    const [isConnected, setIsConnected] = useState(null);
    const [recommendedUsers, setRecommendedUsers] = useState([]);

    useEffect(() => {
        fetchRecommendations();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const user = params.get("username");
        setRequester(user);

        if (user) {
            fetchRecommendations(user);
        }
    }, []);

    const fetchRecommendations = (username) => {
        //axios.get(`http://localhost:8080/api/recommendations?username=${username}`) // Adjust URL as needed
        axios.get(`http://34.16.169.60:8080/api/recommendations?username=${username}`) // Adjust URL as needed
            .then((response) => {
                setRecommendedUsers(response.data);
            })
            .catch((error) => {
                console.error('Error fetching recommendations:', error);
            });
    };

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

    // TODO: note that a connection exists (is there a way to change the UI accordingly??)
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
            <Stack sx={{ paddingTop: 4, flexDirection: 'row', gap: 2 }}>
                
                {/* Left side - Recommended Users */}
                <Box sx={{ width: '30%', minWidth: 300 }}>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>Recommended for You</Typography>
                    {recommendedUsers.map((user, index) => (
                        <Card key={index} sx={{ marginBottom: 2 }}>
                            <CardContent>
                                <Typography variant="subtitle1">{user.username}</Typography>
                                {/* Add more user details here */}
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                {/* Right side - Search Area and Results */}
                <Box sx={{ width: '70%', minWidth: 520 }}>
                    <Card sx={{ marginBottom: 2 }} elevation={4}>
                        <CardContent>
                            <Typography variant='h4' align='center'>Search Users</Typography>
                        </CardContent>
                    </Card>

                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ marginBottom: 2 }}>
                        <Stack spacing={4} direction="row" justifyContent="center">
                            <TextField
                                required
                                id="search"
                                name="search"
                                label="Name or Username"
                                variant="outlined"
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel required id="userType">User Type</InputLabel>
                                <Select
                                    labelId="select userType"
                                    id="select userType"
                                    label="userType"
                                    onChange={(e) => setType(e.target.value)}
                                >
                                    <MenuItem value={null}><em>None</em></MenuItem>
                                    <MenuItem value={"student"}>Student</MenuItem>
                                    <MenuItem value={"tutor"}>Tutor</MenuItem>
                                </Select>
                            </FormControl>
                            <Button variant='contained' color="primary" type="submit">Search</Button>
                        </Stack>
                    </Box>

                    {users.map((user, index) => (
                        <Card key={index} sx={{ marginBottom: 2 }} elevation={6}>
                            <CardContent>
                                <Typography><strong>Username:</strong> {user.username}</Typography>
                                <Typography><strong>Name:</strong> {user.firstName + " " + user.lastName}</Typography>
                                <Button variant='contained' color="primary" size="small" onClick={() => handleClickOpenProfile(user)}>
                                    View Profile
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

            </Stack>

            <Dialog open={openProfile} onClose={handleCloseProfile} fullWidth>
                <DialogTitle>{firstName + " " + lastName}'s Profile</DialogTitle>
                <DialogContent>
                    <Typography>Username: {username}</Typography>
                    <Typography>Email: {emailAddress}</Typography>
                    <Typography>School: {school}</Typography>
                    {/* Add more details or actions here */}
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="error" onClick={handleCloseProfile}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={handleAddConnection}>Connect</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default SearchUsersPage;
