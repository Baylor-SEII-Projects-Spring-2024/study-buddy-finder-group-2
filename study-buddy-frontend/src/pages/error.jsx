import React from 'react';
import Link from "next/link";
import {Stack, Typography} from "@mui/material";

function ErrorPage() {
    return (
        <Stack direction="row"
               alignItems="center"
               justifyContent="center"
               style={{ minHeight: '100vh' }}
        >
            {/* Jurassic park!!!*/}
            <img src="bearWaving.webp" alt="GIF" style={{ width: '100px', marginRight: '20px' }} />

            <Stack textAlign="left">
                <Typography variant='h4'>401: User not authorized</Typography>

                <p>
                    <Link href={`/login`}>
                        <Typography
                            variant='s1'
                            color={"primary"}
                            sx={{
                                textDecoration: 'none',
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            }}
                        >Sign in Here!</Typography>
                    </Link>
                </p>
            </Stack>
        </Stack>
    );
}

export default ErrorPage;