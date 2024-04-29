import React, {useEffect, useState} from 'react';
import axios from 'axios';

import {
    Autocomplete,
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
    TextField, ThemeProvider,
    Typography
} from "@mui/material";
import NotificationPage from "@/pages/Notification";
import {useRouter} from "next/navigation";
import {useDispatch, useSelector} from "react-redux";
import {jwtDecode} from "jwt-decode";
import Avatar from '@mui/material/Avatar';
import Head from "next/head";
import {deauthorize} from "@/utils/authSlice";
import InfoIcon from "@mui/icons-material/Info";
import {ManageSearch} from "@mui/icons-material";
import {createTheme} from "@mui/material/styles";

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

function SearchUsersPage() {
    const router = useRouter();

    const token = useSelector(state => state.authorization.token); //get current state
    const dispatch = useDispatch(); // use to change state

    const[thisUser, setThisUser] = useState(null);
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [emailAddress, setEmail] = useState(null);
    const [userType, setType] = useState(null);
    const [school, setSchool] = useState(null);

    const [searchStr, setStr] = useState(null);
    const [users, setUsers] = useState([]);
    const [recommendedUsers, setRecommendedUsers] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [courses, selectCourse] = useState(null);
    const [filterOpen, setFilterOpen] = useState(false);

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

    const fetchCourses = () => {
        api.get(`api/get-all-courses/`)
            .then((res) => {
                setAllCourses(res.data);
            })
            .catch((err) => {
                alert("Can't get courses at this time");
            })
    }

    // get the user's username
    useEffect(() => {
        try{
            // only authorized users can do this (must have token)
            const decodedUser = jwtDecode(token);
            setThisUser(decodedUser.sub);

            fetchRecommendations(decodedUser.sub);
            fetchCourses()
        }
        catch(err) {
            dispatch(deauthorize());
            router.push(`/error`);
        }
    }, [])

    // search for users matching the specifications
    const handleSubmit = (event) => {
        // prevents page reload
        event.preventDefault();

        let course = courses ? [courses] : null;

        const user = {
            username, firstName, lastName, emailAddress, userType, school, courses:course
        }

        if(searchStr === null) {
            user.username = ""
            user.firstName = ""
            user.lastName = ""
        }

        console.log(user);
        
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

    // get the string the to search with
    const handleSearch = (str) => {
        setStr(str)

        setFirstName(str)
        setLastName(str)
        setUsername(str)
    };

    const handleUsernameClick = (username) => {
        router.push(`/other/${username}`);
        console.log(`Username ${username} clicked!`);
    };

    //Course filtering
    const toggleFilter = () => {
        setFilterOpen(!filterOpen);
        if(!filterOpen){selectCourse(null)}
    }

    // Function to generate a random gradient
    const getRandomGradient = () => {
        // Adjusted color palette to favor green and gold shades
        const colors = ['#a8e063', '#76b947', '#7dce82', '#c0e218', '#f9d423', '#ffcc33', '#eaffd0', '#f4d03f'];
        const randomColor1 = colors[Math.floor(Math.random() * colors.length)];
        const randomColor2 = colors[Math.floor(Math.random() * colors.length)];
        return `linear-gradient(45deg, ${randomColor1}, ${randomColor2})`;
    }

    const userCardRow = (users) => {
        return (
            <Stack sx={{
                overflow: 'auto',
                flexDirection: 'row'
            }}>
                {users && users.map((user, index) => (
                    <Card key={index} sx={{
                        margin: 5,
                        boxShadow: 3,
                        width: 350,
                        transition: 'transform 0.3s ease-in-out, background-color 0.3s ease',
                        background: getRandomGradient(),
                        '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: '5'
                        },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between' // Ensures that the button aligns to the bottom
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Avatar sx={{ width: 30, height: 30, marginBottom: '3px' }} src={user.pictureUrl} />
                                <strong>{user.firstName + " " + user.lastName}</strong>
                                <i>{user.userType}</i>
                            </Box>
                        </CardContent>
                        <Box sx={{ alignSelf: 'flex-end', padding: 3, paddingRight: 0 }}>
                            <Button sx={{
                                height: 0,
                                width: 0,
                                padding: 0,
                                border: 'none',
                                '& .MuiButton-label': {
                                    display: 'none', // Hide the button label
                                },
                            }}
                                onClick={() => handleUsernameClick(user.username)}>
                                <InfoIcon sx={{
                                    minWidth: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    backgroundColor: 'white',
                                    color: '#2e7d32',
                                    '&:hover': {
                                        borderRadius: '50%',
                                        color: '#1b5e20'
                                    }
                                }}/>
                            </Button>
                        </Box>
                    </Card>
                ))}
            </Stack>
        );
    };

    return (
        <>
            <ThemeProvider theme={theme}>
                <Head>
                    <title>Search Users</title>
                </Head>
                <main style={{ backgroundColor: '#e8f5e9' }}>
                    <NotificationPage></NotificationPage>
                    <Stack sx={{ paddingTop: 4, paddingBottom: 4 }} alignItems='center' gap={2}>
                        <Card sx={{
                            width: '100%', maxWidth: '800px', margin: 'auto', padding: 0.5,
                            background: `linear-gradient(135deg, #a8e063 0%, #ffcc33 100%)`,
                            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                            '&:hover': {
                                boxShadow: '0 6px 12px rgba(0,0,0,0.3)', // Enhanced shadow on hover
                            },
                            transition: 'box-shadow 0.3s ease-in-out' // Smooth transition for hover effect
                        }}>
                            {/* this is the search area, submits a form */}
                            <Card sx={{
                                boxShadow: 'none',
                                transition: 'box-shadow 0.3s ease-in-out'
                            }}>
                                <CardContent>
                                    <Typography variant='h3' align='center' style={{ color: '#2e7d32' }}>Search Users</Typography>
                                </CardContent>

                                <Box component="form" noValidate onSubmit={handleSubmit}
                                     sx={{ paddingTop: 2, paddingBottom:5, margin: 'auto' }}>
                                    <Stack direaction="column" gap={3} alignItems="center">
                                        <Stack spacing={4} direction="row" justifyContent="center">
                                            {/* get search string for name and username */}
                                            <Stack direction="column" gap={3.5}>
                                                <TextField
                                                    id="search"
                                                    name="search"
                                                    label="Name or Username"
                                                    variant="outlined"
                                                    defaultValue={""}
                                                    onChange={(e) => handleSearch(e.target.value)}
                                                />
                                                {filterOpen && (
                                                    <Autocomplete
                                                        labelId="filter by courses"
                                                        sx={{maxWidth:200}}
                                                        id="filter-courses"
                                                        label="filter by courses"
                                                        getOptionLabel={(option) => option.coursePrefix+" "+option.courseNumber+" of "+option.school.schoolName}
                                                        value={courses}
                                                        isOptionEqualToValue={(option,value) => option.courseId === value.courseId}
                                                        options={allCourses}
                                                        onChange={(e, params) => selectCourse(params)}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                variant="standard"
                                                                placeholder="Course"
                                                            />
                                                        )}
                                                    />
                                                )}
                                            </Stack>


                                            {/* get requested user type (none, student, tutor) */}
                                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                                <InputLabel required id="userType">User Type</InputLabel>
                                                <Select
                                                    labelId="select userType"
                                                    id="select userType"
                                                    label="userType"
                                                    onChange={(e) => setType(e.target.value)}
                                                >
                                                    <MenuItem value={""} disabled>
                                                        <em>None</em>
                                                    </MenuItem>
                                                    <MenuItem value={"all"}>All Types</MenuItem>
                                                    <MenuItem value={"student"}>Student</MenuItem>
                                                    <MenuItem value={"tutor"}>Tutor</MenuItem>
                                                </Select>
                                                <br/>
                                                <Button variant='outlined' onClick={toggleFilter}>Filter</Button>
                                            </FormControl>
                                        </Stack>
                                        {/* submit the search form to get results */}
                                        <Button
                                            variant='contained'
                                            type="submit"
                                            color="primary"
                                            startIcon={<ManageSearch/>}
                                            sx={{ width: '350px' }}
                                        >
                                            Search</Button>
                                    </Stack>
                                </Box>
                            </Card>
                        </Card>

                        {/* display all matches on separate cards */}
                        {users.map((user, index) => {
                            return(
                                <Card
                                    key={index}
                                    sx={{
                                        width: '100%', maxWidth: '500px', margin: 'auto', padding: 0.5,
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
                    <Stack sx={{ paddingTop: 4, paddingBottom: 4, alignItems: 'center', gap: 2 }}>
                        {/* Info about users, making it slightly less prominent */}
                        <Box sx={{ margin: 5, width: '100%', maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto' }}>
                            <Typography variant='h3' style={{ color: '#2e7d32', textAlign: 'center' }}>Recommended Users</Typography>
                            <Typography variant='h6' color='textSecondary' style={{ textAlign: 'center' }}>Users we think you should become buddies with.</Typography>
                            {recommendedUsers && recommendedUsers.length > 0 ? userCardRow(recommendedUsers) : <div style={{ marginTop: '80px', marginLeft: '300px', marginBottom: '150px', fontSize: '20px', fontWeight: 'bold'}}>No users available.</div>}
                        </Box>
                    </Stack>
                </main>
            </ThemeProvider>
        </>
    );
}

export default SearchUsersPage;