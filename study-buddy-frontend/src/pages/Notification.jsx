import React, { useEffect, useState } from 'react';
import useWebSocket, {useWebsocket} from 'react-use-websocket';
import {Stomp} from '@stomp/stompjs';
import {
    Button,
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
    Box, Table
} from '@mui/material';
import axios from 'axios';
import SettingsIcon from '@mui/icons-material/Settings';

function NotificationPage(){
    const connectToWebSocket = () => {
        const stompClient = Stomp.client("ws://localhost:8080/our-websocket");
        stompClient.heartbeat.outgoing = 20000;
        stompClient.reconnect_delay = stompClient.reconnectDelay;
        let stompRef;
        stompRef.current = stompClient;
    }

    const sendMessage = () => {
        if (message.trim() !== '') {
            sendJsonMessage({ type: 'chat', message });
            setMessage('');
        }
    };

    return (
        <div>
            <div>
                Last received message: {lastJsonMessage && lastJsonMessage.message}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send Message</button>
        </div>
    );
}
export default NotificationPage;
