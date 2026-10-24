import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currency: 'KES',
  theme: 'light',
}

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setCurrency(state, action) {
      state.currency = action.payload
    },
  },
})

export const { setCurrency } = preferencesSlice.actions
export default preferencesSlice.reducer
