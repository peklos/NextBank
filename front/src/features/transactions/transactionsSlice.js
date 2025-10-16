import { createSlice } from "@reduxjs/toolkit";

const transactionsSlice = createSlice({
    name: 'transactions',
    initialState: {
        list: [],
        stats: null,
        loading: false,
        error: null
    },
    reducers: {
        setTransactions: (state, action) => {
            state.list = action.payload;
            state.error = null;
        },
        addTransaction: (state, action) => {
            state.list.unshift(action.payload); // Добавляем в начало
        },
        setTransactionsStats: (state, action) => {
            state.stats = action.payload;
        },
        setTransactionsError: (state, action) => {
            state.error = action.payload;
        },
        setTransactionsLoading: (state, action) => {
            state.loading = action.payload;
        },
        clearTransactions: (state) => {
            state.list = [];
            state.stats = null;
            state.loading = false;
            state.error = null;
        }
    }
});

export const {
    setTransactions,
    addTransaction,
    setTransactionsStats,
    setTransactionsError,
    setTransactionsLoading,
    clearTransactions
} = transactionsSlice.actions;

export default transactionsSlice.reducer;