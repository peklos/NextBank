import { createSlice } from "@reduxjs/toolkit";

const processesSlice = createSlice({
    name: 'processes',
    initialState: {
        list: [],
        stats: null,
        loading: false,
        error: null
    },
    reducers: {
        setProcesses: (state, action) => {
            state.list = action.payload;
            state.error = null;
        },
        addProcess: (state, action) => {
            state.list.push(action.payload);
        },
        updateProcess: (state, action) => {
            const updated = action.payload;
            const idx = state.list.findIndex(process => process.id === updated.id);
            if (idx !== -1) {
                state.list[idx] = { ...state.list[idx], ...updated };
            }
        },
        removeProcess: (state, action) => {
            state.list = state.list.filter(process => process.id !== action.payload);
        },
        setProcessesStats: (state, action) => {
            state.stats = action.payload;
        },
        setProcessesError: (state, action) => {
            state.error = action.payload;
        },
        setProcessesLoading: (state, action) => {
            state.loading = action.payload;
        },
        clearProcesses: (state) => {
            state.list = [];
            state.stats = null;
            state.loading = false;
            state.error = null;
        }
    }
});

export const {
    setProcesses,
    addProcess,
    updateProcess,
    removeProcess,
    setProcessesStats,
    setProcessesError,
    setProcessesLoading,
    clearProcesses
} = processesSlice.actions;

export default processesSlice.reducer;