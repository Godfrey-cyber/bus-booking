import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  dateRange: 'this_month',
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDateRange(state, action) {
      state.dateRange = action.payload
    },
  },
})

export const { setDateRange } = dashboardSlice.actions
export default dashboardSlice.reducer
