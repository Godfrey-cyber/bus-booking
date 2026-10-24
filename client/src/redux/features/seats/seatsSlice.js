import { createSlice } from '@reduxjs/toolkit'

// Tracks live seat-map state so it can be updated by Socket.IO events
// (another passenger reserving/booking a seat) independent of the cart selection.
const initialState = {
  seatMap: [], // [{ seat_number, status: 'available' | 'reserved' | 'booked' }]
  isStale: false, // true when a concurrent booking may have changed availability
}

const seatsSlice = createSlice({
    name: 'seats',
    initialState,
    reducers: {
        setSeatMap(state, action) {
            state.seatMap = action.payload
            state.isStale = false
        },
        markSeatBooked(state, action) {
            const seat = state.seatMap.find((s) => s.seat_number === action.payload)
            if (seat) seat.status = 'booked'
        },
        flagStale(state) {
            state.isStale = true
        },
  },
})

export const { setSeatMap, markSeatBooked, flagStale } = seatsSlice.actions
export default seatsSlice.reducer
