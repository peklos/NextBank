import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        id: null,
        access_token: null,
        first_name: null,
        last_name: null,
        patronymic: null,
        email: null,
        created_at: null,
        isLoggedIn: false,
        phone: null
    },
    reducers: {
        setUser: (state, action) => {
            state.id = action.payload.id || action.payload.client_id
            state.access_token = action.payload.access_token
            state.first_name = action.payload.first_name
            state.last_name = action.payload.last_name
            state.patronymic = action.payload.patronymic
            state.email = action.payload.email
            state.created_at = action.payload.created_at
            state.isLoggedIn = true
            localStorage.setItem('access_token', action.payload.access_token)
        },
        logout: (state) => {
            state.id = null
            state.access_token = null
            state.first_name = null
            state.last_name = null
            state.patronymic = null
            state.email = null
            state.created_at = null
            state.isLoggedIn = false
            localStorage.removeItem('access_token')
        }
    }
})

export const { setUser, logout } = authSlice.actions

export default authSlice.reducer