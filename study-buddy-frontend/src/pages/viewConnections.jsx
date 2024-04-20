import React, {useEffect, useState} from "react";
import {
    Box, Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    Typography
} from "@mui/material";
import axios from "axios";
import NotificationPage from "@/pages/Notification";
import {useRouter} from "next/navigation";
import {useDispatch, useSelector} from "react-redux";
import {jwtDecode} from "jwt-decode";

function viewConnectionsPage() {
    const router = useRouter();

    const token = useSelector(state => state.authorization.token); //get current state
    const dispatch = useDispatch(); // use to change state

    const [thisUser, setThisUser] = useState(null);

    const [username, setUsername] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [emailAddress, setEmail] = useState(null);
    const [userType, setType] = useState(null);
    const [school, setSchool] = useState(null);

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const [selectedConnection, setSelectedConnection] = useState();

    const api = axios.create({
        //baseURL: 'http://localhost:8080/',
        baseURL: 'http://34.16.169.60:8080/',
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
    };

    return (
        <div>
            <NotificationPage></NotificationPage> <br/>
            <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
                <Card sx={{ width: 520, margin: 'auto' }} elevation={4}>
                    <CardContent>
                        <Typography variant='h4' align='center'>Your Connections</Typography>
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
                        Back</Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={deleteConnection}
                    >
                        Disconnect</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default viewConnectionsPage;