import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeBookingId: null,
  transactionStatus: 'idle', // idle | processing | success | rolled_back | error
}

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setActiveBooking(state, action) {
      state.activeBookingId = action.payload
    },
    setTransactionStatus(state, action) {
      state.transactionStatus = action.payload
    },
  },
})

export const { setActiveBooking, setTransactionStatus } = bookingSlice.actions
export default bookingSlice.reducer
