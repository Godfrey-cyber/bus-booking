import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  results: [],
  selectedBusId: null,
}

const busesSlice = createSlice({
    name: 'buses',
    initialState,
        reducers: {
            setResults(state, action) {
            state.results = action.payload
        },
        selectBus(state, action) {
            state.selectedBusId = action.payload
        },
    },
})

export const { setResults, selectBus } = busesSlice.actions
export default busesSlice.reducer
