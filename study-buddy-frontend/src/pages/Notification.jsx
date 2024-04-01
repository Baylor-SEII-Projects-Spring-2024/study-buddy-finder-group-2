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
    Box, Table, AppBar, Toolbar, IconButton
} from '@mui/material';

import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';
import SettingsIcon from '@mui/icons-material/Settings';

function NotificationPage(){
    const [count, setCount] = useState(0);
    const [notificationList, setNotifList] = useState(null);

    const viewNotifications = () => {
        axios.get("", )
            .then((res) => {
                setNotifList(res.data);
                setCount(res.data.filter((x) => x.isRead === true).count);
            })
            .catch((err) => {

            });

    };
    return (
        <Box>
            <AppBar>
                <Toolbar>
                    <Badge badgeContent={count} color="warning">
                    <IconButton
                        aria-label="notifications of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={viewNotifications}
                        color="inherit">
                        <NotificationsIcon/>
                    </IconButton>
                    </Badge>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
export default NotificationPage;
