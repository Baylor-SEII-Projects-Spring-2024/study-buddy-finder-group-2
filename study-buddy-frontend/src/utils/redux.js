import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';

import authReducer from './authSlice';

import storage from 'redux-persist/lib/storage';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'

const persistConfig = {
    key: 'root',
    storage,
}

// reducer functions are used to alter the global state
// this is done by creating an action and then dispatching it to the reducer
const reducers = combineReducers({
    authorization: authReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers)


// the store stores the global state
export const buildStore = (initialState) => {
    const store = configureStore({
        preloadedState: initialState,
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) => {
            return getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                },
            }).concat(thunk);
        },
        devTools: process.env.NODE_ENV !== 'production'
    });

    const persistor = persistStore(store);
    return { store, persistor };
};

// syntax errors!! (I also tried to put this in _app.js, which is why is says reduxStore)
// Infer the `RootState` and `AppDispatch` types from the store itself
//export type RootState = ReturnType<typeof reduxStore.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
//export type AppDispatch = typeof reduxStore.dispatch;
