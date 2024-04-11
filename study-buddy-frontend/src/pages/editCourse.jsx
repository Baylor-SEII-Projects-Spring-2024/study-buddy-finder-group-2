import React, {useEffect, useState} from 'react';
import {Button, RadioGroup, TextField, Box, Grid} from '@mui/material/';
import {
    Autocomplete,
    ButtonGroup,
    FormControlLabel,
    FormLabel, IconButton, Input,
    InputLabel, List, ListItem, ListItemButton, ListItemText,
    MenuItem,
    Radio,
    Select,
    Typography
} from "@mui/material";
import axios, {get} from "axios";
import NotificationPage from "@/pages/Notification";

function EditCoursePage() {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState(null)
    const [courses, setCourses] = useState(null);
    const [course, selectCourse] = useState(null);
    const [usersCourses, setUsersCourses] = useState(null);
    const [coursePrefix, setPrefix] = useState(null);
    const [courseNumber, setNumber] = useState(null);
    const [selectedUserCourse, selectUserCourse] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(1);

    const api = axios.create({
        baseURL: 'http://localhost:8080/'
        //baseURL: 'http://34.16.169.60:8080/'
    });

    useEffect( ()  => {
        const params = new URLSearchParams(window.location.search),
            name = params.get("username");
        setUsername(name);
        console.log(username);

        api.get(`users/${name}`)
            .then((res) => {
                setUser(res.data);
                api.get(`api/get-courses-user/${name}`)
                    .then((res1) =>{
                        setUsersCourses(res1.data);
                        console.log(name);
                        console.log(res1.data);
                    })
                api.get(`api/get-all-courses/`)
                    .then((res2) => {
                        if(res2.data !== null) setCourses(res2.data);
                        else {
                            setCourses(new Set());
                        }
                        console.log(courses);
                    })
            })
            .catch((err) => {
                window.alert("User not found");
            })
    }, [])
    const getUsersCourses = () => {
        api.get(`api/get-courses-user/${username}`)
            .then((res1) =>{
                setUsersCourses(res1.data);
                console.log(username);
                console.log(res1.data);
            })

    }

    const getCourses = () => {
        api.get(`api/get-all-courses/`)
            .then((res1) =>{
                setCourses(res1.data);
            })
    }
    const backToLanding = () => {
        if (user.userType.includes("student")) {
            //temporary fix
            var params = new URLSearchParams();
            params.append("username", user.username.toString());
            console.log("going to /studentLanding?" + params.toString())
            location.href = "/studentLanding?" + params.toString();
        } else if (user.userType.includes("tutor")) {
            var params = new URLSearchParams();
            params.append("username", user.username);
            console.log("going to /tutorLanding?" + params.toString());
            location.href = "/tutorLanding?" + params.toString();
        }
    }


    const createCourse = () => {
        if(courseNumber && coursePrefix){
            selectCourse({
                courseNumber, coursePrefix
            });
        }
        else{
            selectCourse(null);
        }
        console.log({
            coursePrefix: coursePrefix,
            courseNumber: courseNumber,
            users: null,
        });
    }
    const removeCourse = (event) => {
        console.log(`TIME TO REMOVE `+event.coursePrefix+" "+event.courseNumber);
        api.post(`api/remove-course/${username}`, event)
            .then(() => {
                getUsersCourses();
            })
    }
    const handleCourseAdding = (event) => {
        event.preventDefault();
        if(course !== null) {
            api.post(`api/add-user-course/${username}`, course)
                .then((res) => {
                    console.log("yay we did it! Added " + course.coursePrefix + " " + course.courseNumber);
                    selectCourse(null);
                    getUsersCourses();
                    getCourses();
                })
                .catch((err) => {
                    console.log("aww didn't work for " + username + " " + course.coursePrefix + " " + course.courseNumber);
                })
        }
    }
    return (
        <Box>
            <NotificationPage></NotificationPage> <br/>
            <Box sx={{ margin: 5 }}>
                <Typography type="h1" variant="h5" id="coursesLabel">Add Courses</Typography>
                <Button variant="contained" onClick={() => backToLanding()}>Back</Button>

                <Box sx={{ marginTop: 5,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyItems: 'center',}}>
                    <Box sx={{ margin: 5 }}>
                        <Autocomplete // pre-existing course selector
                            id="courses-select"
                            options={courses}
                            sx={{ width: 200}}
                            autoSelect
                            getOptionLabel={(option) => option.coursePrefix+" "+option.courseNumber }
                            isOptionEqualToValue={(option,value) => option.id === value.id}
                            onChange={(e, value) => {
                                selectCourse(value);
                                console.log(value);
                                handleCourseAdding(e);
                            }}
                            renderOption={(props, option) => (
                                <Box component="li" sx={{ display: 'flex'}} {...props}>
                                    {option.coursePrefix} {option.courseNumber}
                                </Box>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select a Course"
                                    inputProps={{
                                        ...params.inputProps,
                                    }}
                                />
                            )}
                        /> <br/>
                        <Button variant="outlined" onClick={(e) => {
                            handleCourseAdding(e);
                        }}>Add Course</Button>
                    </Box>
                    <Box  sx={{ margin: 5 }}
                          component="form" validate="true" onSubmit={handleCourseAdding}>
                        <TextField id="course_prefix" onChange={(event) => setPrefix(event.target.value)} label="Course Prefix" sx={{ width:100 }}/>
                        <br/>
                        <Input id="course_number" onChange={(event) => {setNumber(parseInt(event.target.value,10))}} type = "number" label="Course Number" sx={{ width:100 }}/>
                        <br/>
                        <Button variant="outlined" type="submit" onClick={() => {
                            createCourse();
                            setPrefix(null);
                            setNumber(null);
                            document.getElementById("course_prefix").value = null;
                            document.getElementById("course_number").value = null;
                        }}>Create Course</Button>
                    </Box>
                    <Box  sx={{ margin: 5 }}>
                        <List component="users-courses" aria-label="users-courses">
                            {usersCourses === null ? () => console.log("empty") : usersCourses.map((value) => {
                                const labelId = `checkbox-list-label-${value.coursePrefix} ${value.courseNumber}`;
                                return (
                                    <ListItemButton
                                        selected={ selectedUserCourse === value}
                                    >
                                        <ListItemText id={labelId} primary={`${value.coursePrefix} ${value.courseNumber}`} />
                                        <Button size="small" onClick={() => {
                                            selectUserCourse(value);
                                            console.log(`clicked ${value.coursePrefix} ${value.courseNumber}`);
                                            removeCourse(value);
                                            getCourses();
                                        }}>
                                            X
                                        </Button>
                                    </ListItemButton>
                                );
                            })}
                        </List>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
export default EditCoursePage;