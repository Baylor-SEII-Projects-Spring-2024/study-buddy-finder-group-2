import {createSlice} from "@reduxjs/toolkit";
//import type {PayloadAction} from "@reduxjs/toolkit";

/*export interface AuthState {
    username: string,
    auth: boolean
}*/

const initialState = {
    token: "",
    auth: false
}

export const authSlice = createSlice({
    name: 'authorization',
    initialState,
    reducers: {
        authorize: (state, action) => {
            state.token = action.payload
            state.auth = true
        },
        deauthorize: (state) => {
            state.token = ""
            state.auth = false
        },
    },
})

export const { authorize, deauthorize } = authSlice.actions
export default authSlice.reducer
