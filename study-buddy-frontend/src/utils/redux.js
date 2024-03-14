import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';

import authReducer from './authSlice';

// reducer functions are used to alter the global state
// this is done by creating an action and then dispatching it to the reducer
const reducers = combineReducers({
    authorization: authReducer,
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

// Infer the `RootState` and `AppDispatch` types from the store itself
//export type RootState = ReturnType<typeof reduxStore.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
//export type AppDispatch = typeof reduxStore.dispatch;
