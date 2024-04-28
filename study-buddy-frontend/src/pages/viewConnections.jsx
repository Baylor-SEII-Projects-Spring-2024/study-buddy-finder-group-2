import React, {useEffect, useState} from "react";
import {
    Box, Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack, ToggleButton, ToggleButtonGroup,
    Typography
} from "@mui/material";
import axios from "axios";
import NotificationPage from "@/pages/Notification";
import {useRouter} from "next/navigation";
import {useDispatch, useSelector} from "react-redux";
import {jwtDecode} from "jwt-decode";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CancelIcon from "@mui/icons-material/Cancel";
import Avatar from '@mui/material/Avatar';
import Head from "next/head";

function viewConnectionsPage() {
    const router = useRouter();

    const token = useSelector(state => state.authorization.token); //get current state
    const dispatch = useDispatch(); // use to change state

    const [thisUser, setThisUser] = useState(null);
    const [requestType, setRequestType] = useState("incoming");
    const [incoming, setIncoming] = useState([]);
    const [outgoing, setOutgoing] = useState([]);

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

    const [text, setText] = useState("Connect");

    const api = axios.create({
        baseURL: 'http://localhost:8080/',
        //baseURL: 'http://34.16.169.60:8080/',
        // must add the header to associate requests with the authenticated user
        headers: {'Authorization': `Bearer ${token}`}
    });

    // get the user's username
    // show all connections for that user
    useEffect(() => {
        try{
            // only authorized users can do this (must have token)
            const decodedUser = jwtDecode(token);
            setThisUser(decodedUser.sub);
            fetchConnections(decodedUser.sub);

            fetchInRequests(decodedUser.sub);
        }
        catch(err) {
            router.push(`/error`);
        }
    }, [])

    // get all connections with isConnected = true
    const fetchConnections = (user) => {
        api.get(`api/viewConnections/${user}`)
            .then(data => setUsers(data.data))
            .catch(error => console.error('Error fetching connections:', error));
    };

    // get all connections with isConnected = false
    const fetchInRequests = (user) => {
        api.get(`api/viewInRequests/${user}`)
            .then(data => setIncoming(data.data))
            .catch(error => console.error('Error fetching connections:', error));
    };

    // get all connections with isConnected = false
    const fetchOutRequests = (user) => {
        api.get(`api/viewOutRequests/${user}`)
            .then(data => setOutgoing(data.data))
            .catch(error => console.error('Error fetching connections:', error));
    };

    // delete a connection
    const deleteConnection = (event) => {
        event.preventDefault();

        api.delete(`api/viewConnections/${selectedConnection?.id}`)
            .then((res) => {
                if(res.status === 200) {
                    handleCloseProfile();
                    fetchConnections(thisUser);
                }
            })
            .catch((err) => {
                console.log("ERROR DELETING CONNECTION.");
                console.log(err);
            });

    };

    const handleConnection = (event) => {
        event.preventDefault();

        if(text === "Connect") {
            api.post("api/searchUsers/addConnection", selectedConnection)
                .then((res) => {
                    console.log("CONNECTION ADDED.");
                    if(res.status === 200) {
                        handleCloseProfile();
                        fetchConnections(thisUser);
                        fetchInRequests(thisUser);
                    }
                })
                .catch((err) => {
                    console.log("ERROR ADDING CONNECTION.");
                    console.log(err);
                });
        }
        else if(text === "Disconnect") {
            deleteConnection(event)
        }
    }

    const [openProfile, setOpenProfile] = React.useState(false);

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

        // set connection
        api.post(`api/viewConnections/getConnection/${thisUser}`, user.username)
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

    // get incoming or outgoing requests
    const handleRequestTypeChange = (event) => {
        // prevents page reload
        event.preventDefault();

        // incoming
        if(event.target.value === "incoming") {
            setText("Connect");
            fetchInRequests(thisUser);
        }
        // outgoing
        else if(event.target.value === "outgoing") {
            setText("Pending");
            fetchOutRequests(thisUser);
        }
        else {
            console.log("error with request type?!");
        }
    }

    // cancel a request
    const handleRemoveRequest = (user, in_out) => {

        const connection = {
            requester: thisUser,
            requested: user.username
        }

        api.post(`api/removeInvitation`, connection)
            .then((res) => {
                console.log("REQUEST CANCELLED.");
                if(res.status === 200) {
                    if (in_out === "incoming") {
                        fetchInRequests(thisUser);
                    }
                    else if (in_out === "outgoing") {
                        fetchOutRequests(thisUser);
                    }
                }
            })
            .catch((err) => {
                console.log("ERROR CANCELLING REQUEST.");
                console.log(err);
            });
    }
    const handleUsernameClick = (username) => {
        router.push(`/other/${username}`);
        console.log(`Username ${username} clicked!`);
    };

    return (
        <div>
            <Head>
                <title>My Buddies</title>
            </Head>
            <NotificationPage></NotificationPage> <br/>
            <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
                <Box component="form" noValidate
                     sx={{ paddingTop: 3, width: 550, margin: 'auto' }}>
                    <Stack spacing={4} direction="row" justifyContent="center">
                        {/* get request type (incoming or outgoing) */}
                        <ToggleButtonGroup
                            color="success"
                            value={requestType}
                            exclusive
                            onChange={(e) => {
                                setRequestType(e.target.value);
                                handleRequestTypeChange(e);
                            }}
                            label="request type"
                            type="submit"
                        >
                            <ToggleButton value={"incoming"}>
                                Incoming
                            </ToggleButton>
                            <ToggleButton value={"outgoing"}>
                                Outgoing
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Stack>
                </Box>

                { (requestType === "incoming" ? incoming : outgoing).map((req, index) => (
                    <Card key={index} sx={{ width: '100%', maxWidth: 520, boxShadow: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">{req.firstName} {req.lastName}</Typography>
                                    <Typography variant="body2" color="text.secondary">{req.username}</Typography>
                                </Box>
                                <Stack direction="row" spacing={1}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        startIcon={<VisibilityIcon />}
                                        onClick={() => handleUsernameClick(req)}
                                        sx={{
                                            borderRadius: 20,
                                            textTransform: 'none',
                                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                            '&:hover': {
                                                boxShadow: '0 6px 10px rgba(0,0,0,0.15)'
                                            }
                                        }}
                                    >
                                        View Profile
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        startIcon={<CancelIcon />}
                                        onClick={() => handleRemoveRequest(req, requestType)}
                                        sx={{
                                            borderRadius: 20,
                                            textTransform: 'none',
                                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                            '&:hover': {
                                                backgroundColor: '#d32f2f',
                                                boxShadow: '0 6px 10px rgba(0,0,0,0.15)'
                                            }
                                        }}
                                    >
                                        {requestType === "incoming" ? "Decline" : "Cancel"} Request
                                    </Button>
                                </Stack>
                            </Box>
                        </CardContent>
                    </Card>
                ))}

                <Card sx={{ width: 520, margin: 'auto', marginTop: 3 }} elevation={4}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant='h4' align='center'>{thisUser}'s Buddies</Typography>
                    </CardContent>
                </ Card>

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
                                                <strong>{user.username}</strong>
                                                <br/>
                                                <i>{user.firstName + " " + user.lastName}</i>
                                                <br/>
                                            </li>
                                        </ul>
                                    </Box>

                                    {/* view the profile of that user */}
                                    <Button
                                        variant='contained'
                                        color="primary"
                                        size="small"
                                        sx={{ width: '100px', height: '40px' }}
                                        onClick={() => handleUsernameClick(user.username)}
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
                <DialogTitle variant='s2'>{firstName + " " + lastName}</DialogTitle>
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
                        Back</Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: isConnected ? '#9c27b0' : 'light blue',
                            '&:hover': {
                                backgroundColor: isConnected ? '#6d1b7b' : 'light blue'
                            },
                        }}
                        onClick={handleConnection}
                    >
                        {text}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default viewConnectionsPage;