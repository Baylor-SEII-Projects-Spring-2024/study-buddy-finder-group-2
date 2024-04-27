import React, {useEffect, useState} from 'react';
import axios from 'axios';

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
import NotificationPage from "@/pages/Notification";
import {useRouter} from "next/navigation";
import {useDispatch, useSelector} from "react-redux";
import {jwtDecode} from "jwt-decode";
import Avatar from '@mui/material/Avatar';

function SearchUsersPage() {
    const router = useRouter();

    const token = useSelector(state => state.authorization.token); //get current state
    const dispatch = useDispatch(); // use to change state

    const[thisUser, setThisUser] = useState(null);
    const [username, setUsername] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [emailAddress, setEmail] = useState(null);
    const [userType, setType] = useState(null);
    const [school, setSchool] = useState(null);
    const [searchStr, setStr] = useState(null);
    const [users, setUsers] = useState([]);
    const [recommendedUsers, setRecommendedUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const [id, setId] = useState(null);
    const [requester, setRequester] = useState(null);
    const [requested, setRequested] = useState(null);
    const [isConnected, setIsConnected] = useState(null);
    const [selectedConnection, setSelectedConnection] = useState(null);

    const api = axios.create({
        baseURL: 'http://localhost:8080/',
        //baseURL: 'http://34.16.169.60:8080/',
        // must add the header to associate requests with the authenticated user
        headers: {'Authorization': `Bearer ${token}`},
    });

    const fetchRecommendations = (username) => {
        api.get(`api/recommendations/${username}`)
            .then((response) => {
                setRecommendedUsers(response.data);
            })
            .catch((error) => {
                console.error('Error fetching recommendations:', error);
            });
    };

    // get the user's username
    useEffect(() => {
        try{
            // only authorized users can do this (must have token)
            const decodedUser = jwtDecode(token);
            setThisUser(decodedUser.sub);
            setRequester(decodedUser.sub);

            fetchRecommendations(decodedUser.sub);
        }
        catch(err) {
            router.push(`/error`);
        }
    }, [])

    // search for users matching the specifications
    const handleSubmit = (event) => {
        // prevents page reload
        event.preventDefault();

        const user = {
            username, firstName, lastName, emailAddress, userType, school
        }

        
        api.post(`api/searchUsers/${thisUser}`, user)
            .then((res) => {
                if(res.status === 200){
                    console.log(res.data[0]);
                    setUsers(res.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // delete or add connection base off of current connection status
    const handleConnection = (event) => {
        // prevents page reload
        event.preventDefault();

        const connection = {
            requester, requested, isConnected
        }

        // if the users are currently connected
        if(isConnected) {
            api.delete(`api/searchUsers/deleteConnection/${selectedConnection?.id}`)
                .then((res) => {
                    if(res.status === 200) {
                        handleCloseProfile();
                    }
                })
                .catch((err) => {
                    console.log("ERROR DELETING CONNECTION.");
                    console.log(err);
                });
        }
        // the connection is pending
        else if(selectedConnection.requester === thisUser) {
            console.log(thisUser + " oops");
            // TODO: cancel connection??
        }
        // the users are not currently connected
        else {
            

            api.post("api/searchUsers/addConnection", connection)
                .then((res) => {
                    console.log("CONNECTION ADDED.");
                    if(res.status === 200) {
                        handleCloseProfile();
                    }
                })
                .catch((err) => {
                    console.log("ERROR ADDING CONNECTION.");
                    console.log(err);
                });
        }
    }

    // set connection values
    const handleSetConnection = () => {
        if(!isConnected) {
            setRequester(thisUser);
            setRequested(selectedUser.username);
            setIsConnected(false);
        }
    }

    const [openProfile, setOpenProfile] = useState(false);
    const [text, setText] = useState("Connect");
    // look at document.getElementById("connection")

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

        
        api.post(`api/searchUsers/getConnection/${thisUser}`, user.username)
            .then((res) => {
                setSelectedConnection(res.data);
                setRequester(res.data.requester);
                setRequested(res.data.requested);
                setIsConnected(res.data.isConnected);
                setId(res.data.id);

                if(res.data.isConnected) {
                    setText("Disconnect");
                }
                else if(res.data.requester === thisUser) {
                    setText("Pending");
                }
            })
            .catch((err) => {
                console.error('Error getting connection:', err)
            });

        setOpenProfile(true);
    };

    // close the profile
    // reset connection and user values
    const handleCloseProfile = () => {
        setOpenProfile(false);

        // must reset values for continued search!!
        setUsername(searchStr);
        setFirstName(searchStr);
        setLastName(searchStr);
        setEmail(null);
        setType(null);
        setSchool(null);

        setSelectedConnection(null);
        setRequested(null);
        setRequester(null);
        setIsConnected(false);

        setText("Connect");
    };

    // get the string the to search with
    const handleSearch = (str) => {
        setStr(str);

        setFirstName(str);
        setLastName(str);
        setUsername(str);
    };
    const handleUsernameClick = (username) => {
        router.push(`/other/${username}`);
        console.log(`Username ${username} clicked!`);
    };

    return (
        <Box>
            <NotificationPage></NotificationPage> <br/>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <Box sx={{width: '20%', paddingTop:4}}>
                    <Card sx={{height: 50, marginBottom: 2, elevation: 6}}>
                        <Typography align='center' variant='h6'>Recommended Users</Typography>
                    </Card>
                    {recommendedUsers.map((user, index) => (
                        <Card key={index} sx={{marginBottom: 2}}>
                        <CardContent>
                            <Stack spacing={2} direction="column">
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Stack direction="row" alignItems="center">
                                        <Avatar sx={{ width: 30, height: 30, marginBottom: '3px' }} src={user.pictureUrl} />
                                        <Typography sx={{ marginLeft: '15px', fontWeight: 'bold'}} variant='subtitle1'>{user.username}</Typography>
                                    </Stack>
                                    <Button
                                        variant='contained'
                                        color="primary"
                                        size="small"
                                        onClick={() => handleUsernameClick(user.username)}
                                    >
                                        View Profile
                                    </Button>
                                </Stack>
                                <Typography variant='body2' color='textSecondary'>
                                    <i>{user.firstName} {user.lastName}</i>
                                </Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                    
                    ))}
                </Box>
                <Box sx={{width: '70%'}}>
                    <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
                        <Card sx={{ width: 520, margin: 'auto' }} elevation={4}>
                            <CardContent>
                                <Typography variant='h4' align='center'>Search Users</Typography>
                            </CardContent>

                            {/* this is the search area, submits a form */}
                            <Box component="form" noValidate onSubmit={handleSubmit}
                                 sx={{ paddingTop: 2, paddingBottom:5, margin: 'auto' }}>
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
                                    <FormControl sx={{ m: 1, minWidth: 120 }}>
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
                        </Card>

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
                                                        <Avatar sx={{ width: 50, height: 50, marginBottom: '15px' }} src={user.pictureUrl} />
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
                                                color= "primary"
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
                                {/* error printing school */}
                                {/* <Typography variant='s1'>School: {school}</Typography> */}
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
                                id="connection"
                                variant="contained"
                                sx={{
                                    backgroundColor: isConnected ? '#9c27b0' : 'light blue',
                                    '&:hover': {
                                        backgroundColor: isConnected ? '#6d1b7b' : 'light blue'
                                    },
                                }}
                                type="submit"
                                onClick={handleSetConnection}
                            >
                                {text}</Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </div>
        </Box>
    );
}

export default SearchUsersPage;