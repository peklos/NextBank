import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI, registerAPI } from "./authAPI";

export const loginThunk = createAsyncThunk(
    'auth/login',
    async ({ email, password }, thunkAPI) => {
        try {
            const data = await loginAPI(email, password);
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.detail || error.message)
        }
    }
)

export const registerThunk = createAsyncThunk(
    'auth/register',
    async ({ email, password, full_name }, thunkAPI) => {
        try {
            const data = await registerAPI(email, password, full_name);
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.detail || error.message)
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
        isLoggedIn: false,
        status: 'idle',
        error: null
    },
    reducers: {
        logout: (state) => {
            state.user = null
            state.token = null
            state.isLoggedIn = false
            state.status = 'idle'
            state.error = null
            localStorage.removeItem('token')
        },
        setTokenFromStorage: (state, action) => {
            state.token = action.payload.token
            state.user = action.payload.user
            state.isLoggedIn = true
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginThunk.pending, (state) => {
            state.status = 'loading'
            state.error = null
        }).addCase(loginThunk.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.user = action.payload.user
            state.token = action.payload.access_token
            state.isLoggedIn = true
            localStorage.setItem('token', action.payload.access_token)
        }).addCase(loginThunk.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.payload
        }).addCase(registerThunk.pending, (state) => {
            state.status = 'loading'
            state.error = null
        }).addCase(registerThunk.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.user = action.payload.user
            state.token = action.payload.access_token
            state.isLoggedIn = true
            localStorage.setItem('token', action.payload.access_token)
        }).addCase(registerThunk.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.payload
        })
    }
})

export const { logout, setTokenFromStorage } = authSlice.actions

export default authSlice.reducer