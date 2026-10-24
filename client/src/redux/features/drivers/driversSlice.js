import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  results: [],
  selectedDriverId: null,
}

const driversSlice = createSlice({
    name: 'drivers',
    initialState,
        reducers: {
            setResults(state, action) {
            state.results = action.payload
        },
        selectDriver(state, action) {
            state.selectedDriverId = action.payload
        },
    },
})

export const { setResults, selectDriver } = driversSlice.actions
export default driversSlice.reducer
