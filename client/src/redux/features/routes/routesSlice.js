import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  popularRoutes: [],
}

const routesSlice = createSlice({
  name: 'routesFeature',
  initialState,
  reducers: {
    setPopularRoutes(state, action) {
      state.popularRoutes = action.payload
    },
  },
})

export const { setPopularRoutes } = routesSlice.actions
export default routesSlice.reducer
