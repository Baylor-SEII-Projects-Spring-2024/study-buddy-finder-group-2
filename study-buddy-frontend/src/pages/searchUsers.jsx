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
    TextField,
    Typography
} from "@mui/material";
import NotificationPage from "@/pages/Notification";
import {useRouter} from "next/navigation";
import {useDispatch, useSelector} from "react-redux";
import {jwtDecode} from "jwt-decode";
import Avatar from '@mui/material/Avatar';
import Head from "next/head";
import {deauthorize} from "@/utils/authSlice";

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
    const [allCourses, setAllCourses] = useState([]);
    const [courses, selectCourse] = useState(null);
    const [filterOpen, setFilterOpen] = useState(false);

    const api = axios.create({
        //baseURL: 'http://localhost:8080/',
        baseURL: 'http://34.16.169.60:8080/',
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


    return (
        <Box>
            <Head>
                <title>Search Users</title>
            </Head>
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
                                        <Typography sx={{ marginLeft: '15px', fontWeight: 'bold'}} variant='subtitle1'>{user.firstName} {user.lastName}</Typography>
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
                                    <i>{user.userType}</i>
                                </Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                    
                    ))}
                </Box>
                <Box sx={{width: '70%'}}>
                    <Stack sx={{ paddingTop: 4, paddingBottom: 4 }} alignItems='center' gap={2}>
                        <Card sx={{ width: 520, margin: 'auto' }} elevation={4}>
                            <CardContent>
                                <Typography variant='h4' align='center'>Search Users</Typography>
                            </CardContent>

                            {/* this is the search area, submits a form */}
                            <Box component="form" noValidate onSubmit={handleSubmit}
                                 sx={{ paddingTop: 2, paddingBottom:5, margin: 'auto' }}>
                                <Stack spacing={4} direction="row" justifyContent="center">
                                    {/* get search string for name and username */}
                                    <Stack direction="column">
                                    <TextField
                                        required
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

                                    {/* submit the search form to get results */}
                                    <Button
                                        variant='contained'
                                        color="primary"
                                        type="submit"
                                        sx={{height:55}}
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
                                                onClick={() => handleUsernameClick(user.username)}
                                            >
                                                View Profile</Button>
                                        </Stack>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>

                </Box>
            </div>
        </Box>
    );
}

export default SearchUsersPage;