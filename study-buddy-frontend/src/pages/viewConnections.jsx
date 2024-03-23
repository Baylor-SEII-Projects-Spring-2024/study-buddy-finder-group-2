import React, {useEffect, useState} from "react";
import {
    Box, Button,
    Card,
    CardContent, Dialog, DialogActions, DialogContent, DialogTitle,
    Stack,
    Typography
} from "@mui/material";
import axios from "axios";

function viewConnectionsPage() {
    const [thisUser, setThisUser] = useState(null);

    const [username, setUsername] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [emailAddress, setEmail] = useState(null);
    const [userType, setType] = useState(null);
    const [school, setSchool] = useState(null);

    const [searchStr, setStr] = useState(null);

    const [users, setUsers] = useState([]);
    const [connections, setConnections] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const [selectedConnection, setSelectedConnection] = useState();
    const [id, setId] = useState(null);

    // get the user's username
    useEffect(() => {
        const params = new URLSearchParams(window.location.search),
            user = params.get("username");

        setThisUser(user);
        fetchConnections(user);
    }, [])

    const fetchConnections = (user) => {
        console.log("User to fetch for: " + user);

        fetch(`http://localhost:8080/viewConnections/${user}`) // use this for local development
        //fetch(`http://34.16.169.60:8080/viewConnections/${user}`)
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching connections:', error));
    };

    const deleteConnection = (event) => {
        event.preventDefault();

        axios.delete(`http://localhost:8080/viewConnections/${selectedConnection?.id}`) // for local testing
        //axios.delete(`http://34.16.169.60:8080/viewConnections/${selectedConnection?.id}`)
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

    /*const handleSubmit = (event) => {
        // prevents page reload
        event.preventDefault();

        const user = {
            username, firstName, lastName, emailAddress, userType, school
        }

        // TODO: set error for empty search
        axios.post("http://localhost:8080/api/viewConnections", thisUser) // for local testing
            //axios.get("http://34.16.169.60:8080/api/viewConnections", thisUser)
            .then((res) => {
                console.log(thisUser + "'s connections")

                if(res.status === 200){
                    console.log(res.data[0])
                    setUsers(res.data);
                    //fetchUsers(searchStr);
                }
            })
            .catch((err) => {
                console.log(err.value);
            });
    }*/

    const [openProfile, setOpenProfile] = React.useState(false);

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

        setSelectedConnection(null);
    };

    return (
        <div>
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
                        color="error"
                        onClick={deleteConnection}
                    >
                        Remove</Button>
                </DialogActions>
            </Dialog>
            =        </div>
    );
}

export default viewConnectionsPage;