import React, { useEffect, useState } from 'react';
// import useWebSocket, {useWebsocket} from 'react-use-websocket';
// import {Stomp} from '@stomp/stompjs';
import {
    Button,
    Badge,
    Typography,
    Box,AppBar, Toolbar, IconButton, Menu, MenuItem, ListItemButton, ListItemText, List, Checkbox
} from '@mui/material';

import NotificationsIcon from '@mui/icons-material/Notifications';
import axios, {Axios, defaults} from 'axios';
import SettingsIcon from '@mui/icons-material/Settings';

function NotificationPage(){
    const [username, setUsername] = useState(null);
    const [user, setUser] = useState(null);
    const [count, setCount] = useState(0);
    const [notificationList, setNotifList] = useState(null);
    const [notif, selectNotif] = useState(null)
    const [anchorEl, setAnchorEl] = React.useState(null);


    const api = axios.create({
        baseURL: 'http://localhost:8080/' || 'http://34.16.169.60:8080/'
    });

    const fetchUser = (name) => {
        console.log("User to fetch for: " + name);

        api.get(`users/${name}`)
            .then(async data => {
                await setUser(data);
                setInterval(function () {
                    viewNotifications(name);
                }, 5000);
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
                    console.log(res.data);
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
                        onClick={handleOpen}
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
                                    const labelId = `checkbox-list-label-${value.notificationId}`;
                                    return (
                                        <MenuItem
                                            selected={ notif === value}
                                        >
                                            <Checkbox
                                                onClick={() => {
                                                    switchNotifReadStatus(value);
                                                    value.read = !value.read;
                                                }}>
                                            </Checkbox>
                                            <ListItemText id={labelId}
                                                          fontWeight={value.read ? 400 : 1000 }
                                                          primary={`${value.notificationContent}`} />
                                            <Button size="small" onClick={() => {
                                                selectNotif(value);
                                                console.log(`go to ${value.notificationUrl}`);
                                                deleteNotif(value);
                                            }}>
                                                X
                                            </Button>

                                        </MenuItem>
                                    );
                                })}
                            </List>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
export default NotificationPage;
