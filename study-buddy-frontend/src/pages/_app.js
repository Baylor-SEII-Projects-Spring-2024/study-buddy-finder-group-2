import React from 'react';
import Head from 'next/head';
import { Provider as ReduxProvider } from 'react-redux';

import { AppCacheProvider } from '@mui/material-nextjs/v14-pagesRouter';
import {AppBar, CssBaseline, Toolbar, Typography} from '@mui/material';

import { StudyBuddyThemeProvider } from '@/utils/theme';
import { buildStore } from '@/utils/redux';

import '@/styles/globals.css'
import '@/styles/dynamicnavbar.module.css'
import '@/styles/sidenavbar.module.css'
import {PersistGate} from "redux-persist/integration/react";
import Link from "next/link";

// Initialize Redux
let initialState = {};
let reduxStore = buildStore(initialState);

export default function App({ Component, pageProps }) {
  return (
    <ReduxProvider store={reduxStore.store}>
      <PersistGate loading={null} persistor={reduxStore.persistor}>
        <AppCacheProvider>
          <Head>
            <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
            <link rel='icon' href='/bearWavingTransparentBckgrnd.png' />
          </Head>

          <StudyBuddyThemeProvider>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />

            <Component {...pageProps} />
          </StudyBuddyThemeProvider>

          <AppBar position="static" sx={{ backgroundColor: '#2d4726'}}>
            <Toolbar>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '16px' }}>

                    <Typography variant="h3" style={{ fontFamily: 'Roboto', color: 'gold', marginTop: '30px', marginBottom: '4px', fontWeight: 'bold' }}>
                        StuCon
                    </Typography>

                    <Link href="/about" passHref>
                        <div style={{ textDecoration: 'none', color: 'white', color: 'white', cursor: 'pointer', marginLeft: '16px', marginTop: '8px'}}>
                            About
                        </div>
                    </Link>

                    <Link href="/questions" passHref>
                      <div style={{ textDecoration: 'none', color: 'white', cursor: 'pointer', marginLeft: '16px', marginBottom: '10px'}}>
                        FAQ
                      </div>
                    </Link>

                    <Typography variant="body2" color="white" style={{ marginBottom: '15px' }}>
                    &copy; 2024 StuCon Corporation. All rights reserved.
                    </Typography>
                </div>
            </Toolbar>
        </AppBar>

        </AppCacheProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
