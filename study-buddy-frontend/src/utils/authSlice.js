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
    name: 'authoriztion',
    initialState,
    reducers: {
        authorize: (state, action) => {
            state.token = action.payload
            state.auth = true
        },
        deauthorize: (state) => {
            console.log("logged-in: " + state.auth)
            state.token = ""
            state.auth = false
            console.log("logged-in: " + state.auth)
        },
    },
})

export const { authorize, deauthorize } = authSlice.actions
export default authSlice.reducer
