import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeTripId: null,
  transactionStatus: 'idle', // idle | processing | success | rolled_back | error
}

const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    setActiveTrip(state, action) {
      state.activeTripId = action.payload
    },
    setTransactionStatus(state, action) {
      state.transactionStatus = action.payload
    },
  },
})

export const { setActiveBooking, setTransactionStatus } = tripsSlice.actions
export default tripsSlice.reducer
