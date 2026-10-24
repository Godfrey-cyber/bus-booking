import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    // tripId,
    // scheduleId,
    selectedSeats: [], // [{ seat_number, price }]
    passengers: [], // [{ seat_number, name, age, gender }]
    emergencyContact: null,
    promoCode: null,
    reservationExpiresAt: null, // ISO timestamp for the seat-hold countdown
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    startBooking(state, action) {
        // state.tripId = action.payload.trip_id
        // state.scheduleId = action.payload.schedule_id
        state.selectedSeats = []
        state.passengers = []
        state.reservationExpiresAt = null
    },
    toggleSeat(state, action) {
        const seat = action.payload
        const exists = state.selectedSeats.find((s) => s.seat_number === seat.seat_number)
        state.selectedSeats = exists
            ? state.selectedSeats.filter((s) => s.seat_number !== seat.seat_number)
            : [...state.selectedSeats, seat]
    },
    setReservationExpiry(state, action) {
        state.reservationExpiresAt = action.payload
    },
    setPassengerDetails(state, action) {
        state.passengers = action.payload
    },
    setEmergencyContact(state, action) {
        state.emergencyContact = action.payload
    },
    applyPromoCode(state, action) {
        state.promoCode = action.payload
    },
    clearCart() {
        return initialState
    },
  },
})

export const {
    startBooking,
    toggleSeat,
    setReservationExpiry,
    setPassengerDetails,
    setEmergencyContact,
    applyPromoCode,
    clearCart,
} = cartSlice.actions
export default cartSlice.reducer

export const selectSelectedSeats = (state) => state.cart.selectedSeats
export const selectSeatTotal = (state) =>
  state.cart.selectedSeats.reduce((sum, s) => sum + Number(s.price), 0)
