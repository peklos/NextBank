import { createSlice } from "@reduxjs/toolkit";

const accountsSlice = createSlice({
    name: 'accounts',
    initialState: {
        list: [],
    },
    reducers: {
        setAccounts(state, action) {
            state.list = action.payload
        },
        addAccount(state, action) {
            state.list.push(action.payload)
        },
        removeAccount(state, action) {
            state.list = state.list.filter(acc => acc.id !== action.payload)
        },
        clearAccounts(state) {
            state.list = []
        }
    }
})

export const { setAccounts, addAccount, removeAccount, clearAccounts } = accountsSlice.actions
export default accountsSlice.reducer