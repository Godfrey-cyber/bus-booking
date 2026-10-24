import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  origin: '',
  destination: '',
  date: null,
  passengers: 1,
  filters: {
    amenities: [], // 'ac' | 'wifi' | 'charging' | 'luxury' | 'express'
    operators: [],
    priceRange: null,
    departureWindow: null, // 'morning' | 'afternoon' | 'evening' | 'night'
  },
  sortBy: 'departure', // 'departure' | 'price' | 'duration' | 'rating'
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchParams(state, action) {
      Object.assign(state, action.payload)
    },
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload }
    },
    resetFilters(state) {
      state.filters = initialState.filters
    },
    setSortBy(state, action) {
      state.sortBy = action.payload
    },
  },
})

export const { setSearchParams, setFilters, resetFilters, setSortBy } = searchSlice.actions
export default searchSlice.reducer
