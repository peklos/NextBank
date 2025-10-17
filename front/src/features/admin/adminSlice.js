import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        employees: [],
        roles: [],
        branches: [],
        clients: [],
        processes: [],
        stats: null,
        loading: false,
        error: null
    },
    reducers: {
        setEmployees: (state, action) => {
            state.employees = action.payload;
        },
        addEmployee: (state, action) => {
            state.employees.push(action.payload);
        },
        updateEmployee: (state, action) => {
            const index = state.employees.findIndex(e => e.id === action.payload.id);
            if (index !== -1) {
                state.employees[index] = action.payload;
            }
        },
        removeEmployee: (state, action) => {
            state.employees = state.employees.filter(e => e.id !== action.payload);
        },
        setRoles: (state, action) => {
            state.roles = action.payload;
        },
        addRole: (state, action) => {
            state.roles.push(action.payload);
        },
        updateRole: (state, action) => {
            const index = state.roles.findIndex(r => r.id === action.payload.id);
            if (index !== -1) {
                state.roles[index] = action.payload;
            }
        },
        removeRole: (state, action) => {
            state.roles = state.roles.filter(r => r.id !== action.payload);
        },
        setBranches: (state, action) => {
            state.branches = action.payload;
        },
        addBranch: (state, action) => {
            state.branches.push(action.payload);
        },
        updateBranch: (state, action) => {
            const index = state.branches.findIndex(b => b.id === action.payload.id);
            if (index !== -1) {
                state.branches[index] = action.payload;
            }
        },
        removeBranch: (state, action) => {
            state.branches = state.branches.filter(b => b.id !== action.payload);
        },
        setClients: (state, action) => {
            state.clients = action.payload;
        },
        setProcesses: (state, action) => {
            state.processes = action.payload;
        },
        updateProcess: (state, action) => {
            const index = state.processes.findIndex(p => p.id === action.payload.id);
            if (index !== -1) {
                state.processes[index] = action.payload;
            }
        },
        setStats: (state, action) => {
            state.stats = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearAdmin: (state) => {
            state.employees = [];
            state.roles = [];
            state.branches = [];
            state.clients = [];
            state.processes = [];
            state.stats = null;
            state.loading = false;
            state.error = null;
        }
    }
});

export const {
    setEmployees,
    addEmployee,
    updateEmployee,
    removeEmployee,
    setRoles,
    addRole,
    updateRole,
    removeRole,
    setBranches,
    addBranch,
    updateBranch,
    removeBranch,
    setClients,
    setProcesses,
    updateProcess,
    setStats,
    setLoading,
    setError,
    clearAdmin
} = adminSlice.actions;

export default adminSlice.reducer;