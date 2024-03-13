import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';

import tokenAuth from "@/utils/tokenAuth";

// reducer functions are used to alter the global state
// this is done by creating an action and then dispatching it to the reducer
const reducers = combineReducers({
    token: tokenAuth
});

// the store stores the global state
export const buildStore = (initialState) => {
    return configureStore({
        preloadedState: initialState,
        reducer: reducers,
        middleware: (getDefaultMiddleware) => {
            return getDefaultMiddleware().concat(thunk);
        },
        devTools: process.env.NODE_ENV !== 'production'
    });
};
