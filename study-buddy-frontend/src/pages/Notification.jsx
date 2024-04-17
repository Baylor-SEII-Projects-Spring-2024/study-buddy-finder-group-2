import React, { useEffect, useState } from 'react';

import {
    Button,
    Badge,
    Typography,
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Menu,
    MenuItem,
    ListItemButton,
    ListItemText,
    List,
    Checkbox,
    ThemeProvider,
    createTheme, Tooltip
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios, {Axios, defaults} from 'axios';
import AccountCircle from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import SearchIcon from '@mui/icons-material/Search';
import GroupsIcon from '@mui/icons-material/Groups';
import Link from "next/link";

function NotificationPage() {
    const [username, setUsername] = useState(null);
    const [user, setUser] = useState(null);
    const [count, setCount] = useState(0);
    const [notificationList, setNotifList] = useState(null);
    const [notif, selectNotif] = useState(null)
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [anchorEl2, setAnchorEl2] = React.useState(null);
    const [anchorEl3, setAnchorEl3] = React.useState(null);
    const [ref, setRef] = useState("/login");

    const theme = createTheme({
        palette: {
            primary: { main: '#a0c334' },
            secondary: { main: '#ffd700' },
        },
    });


    const api = axios.create({
        //baseURL: 'http://localhost:8080/'
        baseURL: 'http://34.16.169.60:8080/'
    });

    const checkExpiredMeetups = async (user) => {
        // get user local time zone
        const options = await Intl.DateTimeFormat().resolvedOptions();
        const timezone = options.timeZone;
    
        console.log("Check " + user + "'s expired meetings");

        // TEST
        const currentTimeInUserTimeZone = new Date().toLocaleString('en-US', { timeZone: timezone});
        console.log("Current time in user's time zone:", currentTimeInUserTimeZone);
    
        return api.get(`expiredMeetups/${user}`, {
            headers: {
                'timezone': timezone
            }
        })
        .then(response => response.data)
        .catch(error => {
            console.error('Error checking expired meetups', error);
            return null;
        });
    };

    const fetchUser = (name) => {
        console.log("User to fetch for: " + name);

        api.get(`users/${name}`)
            .then(async data => {
                await setUser(data.data);
                if(data.data.userType === "student"){
                    setRef(`/studentLanding?username=${encodeURIComponent(name)}`)
                }
                else if (data.data.userType === "tutor"){
                    setRef(`/tutorLanding?username=${encodeURIComponent(name)}`)
                }
                viewNotifications(name);
                setInterval(function () {
                    viewNotifications(name);
                    checkExpiredMeetups(name);
                }, 10000);
            })
            .catch(error => console.error('Error fetching user:', error));

    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search),
            name = params.get("username");

        setUsername(name);
        fetchUser(name);
    }, []);

    const viewNotifications = (name) => {
            api.get(`api/notification/getNotifications/${name}`)
                .then((res) => {
                    setNotifList(res.data);
                    setCount(res.data.filter(x => x.read === false).length);
                })
                .catch((err) => {
                    console.log("Uh oh, can't get notifications");
                    setNotifList(null);
                });
    }

    const switchNotifReadStatus = (value) => {
        api.post(`api/notification/switchNotificationReadStatus`, value)
            .then((res) => {
                selectNotif(null);
                console.log(res.read);
            })
            .catch((err) => {
                console.log("Uh oh, can't get notifications");
                selectNotif(null);
            });
    }

    const deleteNotif = (value) => {
        api.post(`api/notification/deleteNotification`, value)
            .then((res) => {
                selectNotif(null);
                console.log("notification deleted");
            })
            .catch((err) => {
                console.log("Uh oh, can't get notifications");
                selectNotif(null);
            });
    }


    const handleNotifOpen = (e) => {
        setAnchorEl(e.currentTarget);
    }

    const handleNotifClose = () => {
        setAnchorEl(null);
    };

    const handleProfileOpen = (e) => {
        setAnchorEl2(e.currentTarget);
    }

    const handleProfileClose = () => {
        setAnchorEl2(null);
    };

    const handleSearchOpen = (e) => {
        setAnchorEl3(e.currentTarget);
    }

    const handleSearchClose = () => {
        setAnchorEl3(null);
    };

    const empty = () => {
        return (
          <MenuItem>No Notifications</MenuItem>
        );
    };

    return (
        <ThemeProvider theme={theme}>
        <Box>
            <AppBar  style={{

                boxShadow: "none"
            }}>
                <Toolbar>

                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <a href={ref}>
                            StuddyBuddy
                        </a>
                    </Typography>

                    <div>
                        <Link href={ref} passHref>
                            <Button color="inherit"><HomeIcon></HomeIcon>Home</Button>
                        </Link>
                        <Link href={`/invitations?username=${encodeURIComponent(username)}`} passHref>
                            <Button color="inherit">Invitations</Button>
                        </Link>
                        <Link href={`/viewMeetups?username=${encodeURIComponent(username)}`} passHref>
                            <Button color="inherit"><MeetingRoomIcon></MeetingRoomIcon>View Meetups</Button>
                        </Link>
                        <Button color="inherit" onClick={handleSearchOpen} on={handleSearchOpen}><SearchIcon/>Search</Button>
                        <Menu anchorEl={anchorEl3}
                              open={Boolean(anchorEl3)}
                              onClose={handleSearchClose}
                              anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                              transformOrigin={{vertical: 'top', horizontal: 'right'}}
                              keepMounted>
                            <MenuItem><Link href={`/searchUsers?username=${encodeURIComponent(username)}`} passHref>
                                Search Users
                            </Link></MenuItem>
                            <MenuItem><Link href={`/searchMeetups?username=${encodeURIComponent(username)}`} passHref>
                                Search Meetups
                            </Link></MenuItem>
                        </Menu>

                        <Link href={`/viewConnections?username=${encodeURIComponent(username)}`} passHref>
                            <Button color="inherit"><GroupsIcon/>Buddies</Button>
                        </Link>
                    <Badge badgeContent={count} color="warning">
                        <Tooltip title={"notifications"}>
                            <IconButton
                                aria-label="notifications of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                size="large"
                                onClick={(e) => handleNotifOpen(e)}
                                color="inherit">
                                <NotificationsIcon/>
                            </IconButton>
                        </Tooltip>
                    </Badge>
                        <Menu anchorEl={anchorEl}
                              anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                              transformOrigin={{vertical: 'top', horizontal: 'right'}}
                              keepMounted
                              sx={{ minWidth: 250, maxWidth: 400,
                                    maxHeight: 400}}
                              open={Boolean(anchorEl)}
                              onClose={handleNotifClose}>
                            <List
                              id="notification-appbar" component="notifications" aria-label="notifications">
                                {(notificationList === null || notificationList.length === 0) ? empty()
                                 : notificationList.map((value) => {
                                    const labelId = `checkbox-list-label-${value.notificationId}`;
                                    return (
                                        <MenuItem sx={{width:300,
                                            whiteSpace: "normal",
                                            }}
                                            selected={ notif === value}
                                        >
                                            <Checkbox checked={value.read}
                                                onClick={() => {
                                                    if(value.read) {
                                                        setCount(count+1);
                                                    }
                                                    else {
                                                        setCount(count-1);
                                                    }
                                                    switchNotifReadStatus(value);
                                                    value.read = !value.read
                                                }}>
                                            </Checkbox>
                                            <Link href={`${value.notificationUrl}?username=${encodeURIComponent(username)}`}>
                                            <ListItemText id={labelId}
                                                          fontWeight={value.read ? 400 : 1000 }
                                                          primary={`${value.notificationContent}`} />
                                            </Link>
                                            <Button size="small" onClick={() => {
                                                selectNotif(value);
                                                deleteNotif(value);
                                                notificationList.splice(notificationList.indexOf(value),1);
                                            }}>X</Button>
                                        </MenuItem>
                                    );
                                })}
                            </List>
                        </Menu>
                        <Tooltip title={"profile"}>
                            <IconButton onClick={(e) => handleProfileOpen(e)}>
                                <AccountCircle/>
                            </IconButton>
                        </Tooltip>
                            <Menu anchorEl={anchorEl2}
                                  open={Boolean(anchorEl2)}
                                  onClose={handleProfileClose}
                                  anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                                  transformOrigin={{vertical: 'top', horizontal: 'right'}}
                                  keepMounted>
                                <MenuItem><Link href={`/me?username=${encodeURIComponent(username)}`} passHref>
                                    My Profile
                                </Link></MenuItem>
                                <MenuItem><Link href={`/`} passHref>
                                    Logout
                                </Link></MenuItem>
                            </Menu>
                    </div>
                </Toolbar>
            </AppBar>
            <br/>
            <br/>
            <br/>
        </Box>
        </ThemeProvider>
    );
}
export default NotificationPage;
