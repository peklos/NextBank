import { createSlice } from "@reduxjs/toolkit";

const loansSlice = createSlice({
    name: 'loans',
    initialState: {
        list: [],
        loading: false,
        error: null
    },
    reducers: {
        setLoans: (state, action) => {
            state.list = action.payload;
            state.error = null;
        },
        addLoan: (state, action) => {
            state.list.push(action.payload);
        },
        updateLoan: (state, action) => {
            const updated = action.payload;
            const idx = state.list.findIndex(loan => loan.id === updated.id);
            if (idx !== -1) {
                state.list[idx] = { ...state.list[idx], ...updated };
            }
        },
        removeLoan: (state, action) => {
            state.list = state.list.filter(loan => loan.id !== action.payload);
        },
        setLoansError: (state, action) => {
            state.error = action.payload;
        },
        setLoansLoading: (state, action) => {
            state.loading = action.payload;
        },
        clearLoans: (state) => {
            state.list = [];
            state.loading = false;
            state.error = null;
        }
    }
});

export const {
    setLoans,
    addLoan,
    updateLoan,
    removeLoan,
    setLoansError,
    setLoansLoading,
    clearLoans
} = loansSlice.actions;

export default loansSlice.reducer;