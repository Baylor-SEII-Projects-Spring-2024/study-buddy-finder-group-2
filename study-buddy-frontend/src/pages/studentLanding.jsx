import React, {useState} from 'react';
import Head from "next/head";

import {Button, Menu, MenuItem, Typography} from "@mui/material";

function StudentLandingPage() {
    // The anchor sets the location of the popper (where the menu appears)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    // onClick, set the anchor to that element
    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
    };
    // to close the menu, set the anchor to NULL
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Head>
                <title>LandingPage (Student)</title>
            </Head>

            <main>
                {/* The button where the menu appears */}
                <Button
                    id="menu-v1"
                    aria-controls={open ? 'menu-v1' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >
                     Menu
                </Button>

                {/* Set up of the menu */}
                <Menu
                    id="positioned-menuv1"
                    aria-labelledby="menu-v1"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    {/* Set up menu items */}
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                    <MenuItem onClick={handleClose}>Logout</MenuItem>
                </Menu>
            </main>
        </>
    );
}

export default StudentLandingPage;
