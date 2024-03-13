import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";

export interface AuthState {
    username: string,
    auth: boolean
}

const initialState: AuthState = {
    username: "",
    auth: false
}

export const authSlice = createSlice({
    name: 'authoriztion',
    initialState,
    reducers: {
        authorize: (state, action: PayloadAction<string>) => {
            state.username = action.payload
            state.auth = true
        },
        deauthorize: (state) => {
            state.username = ""
            state.auth = false
        },
    },
})

export const { authorize, deauthorize } = authSlice.actions
export default authSlice.reducer

/*import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AuthState {
    value: string
}

const initialState: AuthState = {
    value: "",
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authorize: (state, action: PayloadAction<string>) => {
            state.value = action.payload
        },
        deauthorize: (state) => {
            state.value = ""
        },
    },
})

// Action creators are generated for each case reducer function
export const { authorize, deauthorize } = authSlice.actions

export default authSlice.reducer*/
