import React, { useEffect, useState } from 'react';
import useWebSocket, {useWebsocket} from 'react-use-websocket';
import {Stomp} from '@stomp/stompjs';
import {
    Button,
    Badge,
    Grid,
    Card,
    CardContent,
    Stack,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Box, Table, AppBar, Toolbar, IconButton, Menu, MenuItem, ListItemButton, ListItemText, List
} from '@mui/material';

import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';
import SettingsIcon from '@mui/icons-material/Settings';

function NotificationPage(){
    const [username, setUsername] = useState(null);
    const [user, setUser] = useState(null);
    const [count, setCount] = useState(0);
    const [notificationList, setNotifList] = useState(null);
    const [notif, selectNotif] = useState(null)
    const [anchorEl, setAnchorEl] = React.useState(null);


    axios.defaults.baseURL = 'http://localhost:8080/';
    //axios.defaults.baseURL = 'http://34.16.169.60:8080/';

    const fetchUser = (user) => {
        console.log("User to fetch for: " + user);

        fetch(`me/${user}`)
            .then(response => response.json())
            .then(data => setUser(data))
            .catch(error => console.error('Error fetching user:', error));
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search),
            user = params.get("username");

        setUsername(user);
        fetchUser(user);
    }, []);

    const delay = (t) => new Promise(resolve => setTimeout(resolve, t));


    const viewNotifications = async () => {
        let more = true;
        while (more) {
            axios.get(`api/notification/getNotifications/${username}`)
                .then((res) => {
                    setNotifList(res.data);
                    setCount(res.data.filter((x) => x.isRead === true).length);
                })
                .catch((err) => {
                    console.log("Uh oh, can't get notifications");
                    setNotifList(null);
                });

            await delay(5000);

        }
    }

    const switchNotifReadStatus = () => {
        axios.post(`api/notification/switchNotificationReadStatus`, notif)
            .then((res) => {
                selectNotif(null);
                console.log(res.isRead);
            })
            .catch((err) => {
                console.log("Uh oh, can't get notifications");
                selectNotif(null);
            });
    }

    const handleOpen = () => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <Box>
            <AppBar>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Stuff
                    </Typography>
                    <div>
                    <Badge badgeContent={count} color="warning">
                    <IconButton
                        aria-label="notifications of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        size="large"
                        edge="right"
                        onClick={viewNotifications && handleOpen}
                        color="inherit">
                        <NotificationsIcon/>
                    </IconButton>
                    </Badge>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <List component="notifications" aria-label="notifications">
                                {notificationList === null ? () => console.log("empty") : notificationList.map((value) => {
                                    const labelId = `checkbox-list-label-${value.content}`;
                                    return (
                                        <MenuItem
                                            selected={ notif === value}
                                        >
                                            <ListItemText id={labelId} primary={`${value.content}`} />
                                            <Button size="small" onClick={() => {
                                                selectNotif(value);
                                                console.log(`clicked ${value.courseNumber}`);

                                            }}>
                                                []
                                            </Button>
                                        </MenuItem>
                                    );
                                })}
                            </List>
                            <MenuItem onClick={handleClose}>Profile</MenuItem>
                            <MenuItem onClick={handleClose}>My account</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
export default NotificationPage;
