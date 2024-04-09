import React, { useEffect, useState } from 'react';
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
import { createTheme } from '@mui/material/styles';
import axios from 'axios';

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
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isError, setIsError] = useState(false);

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

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);

        const user = {
            username,
            password
        };

        axios.post('http://localhost:8080/api/login', user)
        //axios.post('http://34.16.169.60:8080/api/login', user)
            .then((res) => {
                if (res.status === 200) {
                    console.log('User is recognized!');
                    console.log(res.data);

                    setSnackbarMessage('Login Successful');
                    setIsError(false);
                    setSnackbarOpen(true);

                    setTimeout(() => { // Delay for showing the message before redirection
                        var params = new URLSearchParams();
                        params.append("username", res.data.username);

                        if (res.data.userType.includes("student")) {
                            window.location.href = "/studentLanding?" + params.toString();
                        } else if (res.data.userType.includes("tutor")) {
                            window.location.href = "/tutorLanding?" + params.toString();
                        }
                    }, 500);
                } else {
                    throw new Error('Login failed');
                }
            })
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
