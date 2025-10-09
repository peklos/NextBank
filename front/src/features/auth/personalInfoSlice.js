import { createSlice } from "@reduxjs/toolkit";

const personalInfoSlice = createSlice({
    name: 'personalInfo',
    initialState: {
        passport_number: null,
        address: null,
        birth_date: null,
        employment_status: null
    },
    reducers: {
        setPersonalInfo: (state, action) => {
            state.passport_number = action.payload.passport_number
            state.address = action.payload.address
            state.birth_date = action.payload.birth_date
            state.employment_status = action.payload.employment_status
        },
        clearPersonalInfo: (state) => {
            state.passport_number = null
            state.address = null
            state.birth_date = null
            state.employment_status = null
        }
    }
})

export const { setPersonalInfo, clearPersonalInfo } = personalInfoSlice.actions
export default personalInfoSlice.reducer