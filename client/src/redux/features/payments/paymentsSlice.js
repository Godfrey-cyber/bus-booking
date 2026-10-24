import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  method: null, // 'stripe' | 'mpesa' | 'card' | 'wallet' | 'bank_transfer'
  status: 'idle', // idle | pending | processing | success | failed | cancelled | refunded
}

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    setPaymentMethod(state, action) {
      state.method = action.payload
    },
    setPaymentStatus(state, action) {
      state.status = action.payload
    },
  },
})

export const { setPaymentMethod, setPaymentStatus } = paymentsSlice.actions
export default paymentsSlice.reducer
