import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        access_token: null,
        full_name: null,
        email: null,
        created_at: null,
        isLoggedIn: false
    },
    reducers: {
        setUser: (state, action) => {
            state.access_token = action.payload.access_token
            state.full_name = action.payload.full_name
            state.email = action.payload.email
            state.created_at = action.payload.created_at
            state.isLoggedIn = true
            localStorage.setItem('access_token', action.payload.access_token)
        },
        logout: (state) => {
            state.access_token = null
            state.full_name = null
            state.email = null
            state.created_at = null
            state.isLoggedIn = false
            localStorage.removeItem('access_token')
        }
    }
})

export const { setUser, logout } = authSlice.actions

export default authSlice.reducer