import { createSlice } from "@reduxjs/toolkit";

const employeeSlice = createSlice({
    name: 'employee',
    initialState: {
        id: null,
        access_token: null,
        first_name: null,
        last_name: null,
        patronymic: null,
        email: null,
        is_active: false,
        created_at: null,
        role: null,
        branch: null,
        isLoggedIn: false
    },
    reducers: {
        setEmployee: (state, action) => {
            state.id = action.payload.id || action.payload.employee_id;
            state.access_token = action.payload.access_token;
            state.first_name = action.payload.first_name;
            state.last_name = action.payload.last_name;
            state.patronymic = action.payload.patronymic;
            state.email = action.payload.email;
            state.is_active = action.payload.is_active;
            state.created_at = action.payload.created_at;
            state.role = action.payload.role;
            state.branch = action.payload.branch;
            state.isLoggedIn = true;
            localStorage.setItem('employee_token', action.payload.access_token);
        },
        logoutEmployee: (state) => {
            state.id = null;
            state.access_token = null;
            state.first_name = null;
            state.last_name = null;
            state.patronymic = null;
            state.email = null;
            state.is_active = false;
            state.created_at = null;
            state.role = null;
            state.branch = null;
            state.isLoggedIn = false;
            localStorage.removeItem('employee_token');
        }
    }
});

export const { setEmployee, logoutEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;