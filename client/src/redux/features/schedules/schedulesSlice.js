import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  popularSchedules: [],
}

const schedulesSlice = createSlice({
  name: 'schedulesFeature',
  initialState,
  reducers: {
    setPopularSchedule(state, action) {
        state.popularSchedule = action.payload
    },
  },
})

export const { setPopularSchedules } = schedulesSlice.actions
export default schedulesSlice.reducer
