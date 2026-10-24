import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  results: [],
  selectedBusSeatId: null,
}

const busSeatSlice = createSlice({
  name: 'busSeats',
  initialState,
  reducers: {
    setResults(state, action) {
      state.results = action.payload
    },
    selectBusSeat(state, action) {
      state.selectedBusId = action.payload
    },
  },
})

export const { setResults, selectBusSeat } = busSeatSlice.actions
export default busSeatSlice.reducer