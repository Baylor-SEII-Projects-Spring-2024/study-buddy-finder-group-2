import React, {useEffect, useState} from "react";
import {
    Box, Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack, ThemeProvider, ToggleButton, ToggleButtonGroup,
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
import {deauthorize} from "@/utils/authSlice";
import {createTheme} from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";

const theme = createTheme({
    palette: {
        primary: {
            main: '#2e7d32',
        },
        secondary: {
            main: '#ffc107',
        },
        error: {
            main: '#f44336',
        },
    },
});

function viewConnectionsPage() {
    const router = useRouter();

    const token = useSelector(state => state.authorization.token); //get current state
    const dispatch = useDispatch(); // use to change state

    const [thisUser, setThisUser] = useState(null);
    const [requestType, setRequestType] = useState("incoming");
    const [incoming, setIncoming] = useState([]);
    const [outgoing, setOutgoing] = useState([]);

    const [users, setUsers] = useState([]);

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
            dispatch(deauthorize());
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

    // get incoming or outgoing requests
    const handleRequestTypeChange = (event) => {
        // prevents page reload
        event.preventDefault();

        // incoming
        if(event.target.value === "incoming") {
            fetchInRequests(thisUser);
        }
        // outgoing
        else if(event.target.value === "outgoing") {
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
        <>
            <ThemeProvider theme={theme}>
                <Head>
                    <title>My Buddies</title>
                </Head>

                <main style={{ backgroundColor: '#e8f5e9' }}>
                    <NotificationPage></NotificationPage>

                    <Stack sx={{ minHeight: 650, paddingTop: 4, paddingBottom: 4 }} justifyContent='space-evenly' gap={2} direction="row">
                        <Stack alignItems='center' width={'450px'}>
                            <Stack direction="column" alignItems="center">
                                {/* get request type (incoming or outgoing) */}
                                <Box sx={{ marginBottom: 5, width: '100%' }}>
                                    <Typography variant="h3" align="center" style={{ color: '#2e7d32' }}>Invitations</Typography>
                                    <Typography variant='h6' color='textSecondary' align="center">Let's be studdy buddies!</Typography>
                                </Box>

                                <ToggleButtonGroup
                                    color="secondary"
                                    value={requestType}
                                    exclusive
                                    onChange={(e) => {
                                        setRequestType(e.target.value);
                                        handleRequestTypeChange(e);
                                    }}
                                    label="request type"
                                    type="submit"
                                    sx={{
                                        marginBottom: 3
                                    }}
                                >
                                    <ToggleButton value={"incoming"}>
                                        Incoming
                                    </ToggleButton>
                                    <ToggleButton value={"outgoing"}>
                                        Outgoing
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Stack>

                            { (requestType === "incoming" ? incoming : outgoing).map((req, index) => {
                                return(
                                    <Card
                                        key={index}
                                        sx={{
                                            width: '100%', margin: 2, padding: 0.5,
                                            background: `linear-gradient(${Math.floor(Math.random() * 360)}deg, #a8e063 0%, #ffcc33 100%)`,
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                                            '&:hover': {
                                                boxShadow: '0 6px 12px rgba(0,0,0,0.3)', // Enhanced shadow on hover
                                            },
                                            transition: 'box-shadow 0.3s ease-in-out' // Smooth transition for hover effect
                                        }}>
                                        <Card sx={{
                                            boxShadow: 'none',
                                            transition: 'box-shadow 0.3s ease-in-out'
                                        }}>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Box>
                                                        <Typography variant="subtitle1" fontWeight="bold">{req.firstName} {req.lastName}</Typography>
                                                        <Typography variant="body2" color="text.secondary">{req.userType}</Typography>
                                                    </Box>
                                                    <Stack direction="row" spacing={1}>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            size="small"
                                                            startIcon={<InfoIcon />}
                                                            onClick={() => handleUsernameClick(req.username)}
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
                                                            {requestType === "incoming" ? "Decline" : "Cancel"}
                                                        </Button>
                                                    </Stack>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Card>
                                )
                            })}
                        </Stack>

                        <Stack alignItems='center' gap={2} width={'450px'}>
                            <Box sx={{ marginBottom: 5, width: '100%' }}>
                                <Typography variant="h3" align="center" style={{ color: '#2e7d32' }}>{thisUser}'s Buddies</Typography>
                                <Typography variant='h6' color='textSecondary' align="center">Let's study together!</Typography>
                            </Box>

                            {/* display all matches on separate cards */}
                            {users.map((user, index) => {
                                return(
                                    <Card
                                        key={index}
                                        sx={{
                                            width: '100%', maxWidth: '500px', margin: 1, padding: 0.5,
                                            background: `linear-gradient(${Math.floor(Math.random() * 360)}deg, #a8e063 0%, #ffcc33 100%)`,
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                                            '&:hover': {
                                                boxShadow: '0 6px 12px rgba(0,0,0,0.3)', // Enhanced shadow on hover
                                            },
                                            transition: 'box-shadow 0.3s ease-in-out' // Smooth transition for hover effect
                                        }}>
                                        <Card sx={{
                                            boxShadow: 'none',
                                            transition: 'box-shadow 0.3s ease-in-out'
                                        }}>
                                            <CardContent>
                                                <Box sx={{paddingTop: 3, width: 400, margin: 'auto'}}>
                                                    <Stack spacing={13} direction="row" justifyContent="space-evenly"
                                                           alignItems="center">
                                                        <Stack direction="row" sx={{width: 150}}>
                                                            <Avatar sx={{
                                                                width: 50,
                                                                height: 50,
                                                                marginBottom: '15px',
                                                                marginRight: '15px'
                                                            }} src={user.pictureUrl}/>
                                                            <ul style={{listStyleType: 'none', padding: 0, margin: 0}}>
                                                                <li>
                                                                    <strong>{user.firstName + " " + user.lastName}</strong>
                                                                    <br/>
                                                                    <i>{user.userType}</i>
                                                                    <br/>
                                                                </li>
                                                            </ul>
                                                        </Stack>

                                                        {/* view the profile of that user */}
                                                        <Button
                                                            variant='contained'
                                                            color="primary"
                                                            size="small"
                                                            sx={{
                                                                borderRadius: 20,
                                                                textTransform: 'none',
                                                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                                                '&:hover': {
                                                                    boxShadow: '0 6px 10px rgba(0,0,0,0.15)'
                                                                },
                                                                height: 40
                                                            }}
                                                            startIcon={<InfoIcon/>}
                                                            onClick={() => handleUsernameClick(user.username)}
                                                        >
                                                            View Profile</Button>
                                                    </Stack>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Card>
                                )
                            })}
                        </Stack>
                    </Stack>

                </main>
            </ThemeProvider>
        </>
    );
}

export default viewConnectionsPage;