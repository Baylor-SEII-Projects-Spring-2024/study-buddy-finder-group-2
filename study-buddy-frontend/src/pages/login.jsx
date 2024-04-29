import React, { useEffect, useState } from 'react';
import {useDispatch, useSelector} from "react-redux";
import { createTheme } from '@mui/material/styles';

import Head from "next/head";
import Link from "next/link";
import axios from "axios";

import { jwtDecode } from "jwt-decode";

import {
    Button,
    TextField,
    Box,
    Grid,
    Typography,
    Card,
    CardContent,
    Snackbar,
    CircularProgress,
    ThemeProvider
} from '@mui/material';
import {authorize, deauthorize} from "@/utils/authSlice";
import {useRouter} from "next/navigation";

const theme = createTheme({
    palette: {
        primary: {
            main: '#4caf50',
        },
        secondary: {
            main: '#ffeb3b',
        },
        error: {
            main: '#f44336',
        },
    },
});

function LoginPage() {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isError, setIsError] = useState(false);

    const token = useSelector(state => state.authorization.token); //get current state
    const dispatch = useDispatch(); // use to change state

    const api = axios.create({
        //baseURL: 'http://localhost:8080/',
        baseURL: 'http://34.16.169.60:8080/',
    });


    useEffect(() => {
        const handleMouseMove = (event) => {
            setMousePosition({ x: event.clientX, y: event.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const backgroundStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, #4caf50, #ffeb3b)`,
        transition: 'background 0.5s'
    };

    // gets username and password data from the text fields
    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);

        const user = {
            username,
            password
        };

        // connecting to backend to authorize user
        api.post(`api/authorization/login`, user)
            .then((res) => {
                // this is decoding the token to pass the username to the reducer function
                // decode does not return a JSON (returns a JwtPayload object)
                const token  = res.data;

                const decodedUser = jwtDecode(token);
                // just enter decodedToken.customClaim!! (easy!!)

                // this changes the state
                // (passes token and sets auth = true)
                dispatch(authorize(token));

                // find a different way to decide if student or tutor
                if(res.status === 200) {
                    setSnackbarMessage('Login Successful');
                    setIsError(false);
                    setSnackbarOpen(true);

                    setTimeout(() => { // Delay for showing the message before redirection
                        if (decodedUser.userType === "student") {
                            router.push(`/studentLanding`);
                        }
                        else if (decodedUser.userType === "tutor") {
                            router.push(`/tutorLanding`);
                        }
                    }, 500);
                }
                else {
                    throw new Error('Login failed');
                }
            })
            // catches the bad response (error)
            .catch((err) => {
                console.error(err);
                setIsError(true);
                setSnackbarMessage('Incorrect username or password!');
                setSnackbarOpen(true);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <ThemeProvider theme={theme}>
            <Head>
                <title>Login</title>
            </Head>
            <Box sx={backgroundStyle}>
                <Card
                    sx={{
                        maxWidth: 400,
                        width: '70%',
                        backdropFilter: 'blur(10px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'scale(1.05)'
                        },
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        borderRadius: '15px',
                    }}
                >
                    <CardContent>
                        <Typography variant="h5" align="center" gutterBottom>Login</Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                {/* Form fields */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Username"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        required
                                        sx={{ input: { color: theme.palette.primary.main } }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                        sx={{ input: { color: theme.palette.primary.main } }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        sx={{ mt: 3, mb: 2 }}
                                        disabled={loading}
                                    >
                                        {loading ? <CircularProgress size={24} /> : 'Sign In'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                        <Link href={'/registration'}>
                            <Typography
                                variant='s1'
                                align="center"
                                color={"primary"}
                                sx={{
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline'
                                    },
                                    display: 'block',
                                }}
                            >Create an Account!</Typography>
                        </Link>
                    </CardContent>
                </Card>
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={() => setSnackbarOpen(false)}
                    message={snackbarMessage}
                    sx={{
                        '& .MuiSnackbarContent-root': {
                            backgroundColor: isError ? theme.palette.error.main : theme.palette.primary.main,
                        },
                    }}
                />
            </Box>
        </ThemeProvider>
    );
}

export default LoginPage;
