import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isMobileNavOpen: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMobileNav(state) {
      state.isMobileNavOpen = !state.isMobileNavOpen
    },
    closeMobileNav(state) {
      state.isMobileNavOpen = false
    },
  },
})

export const { toggleMobileNav, closeMobileNav } = uiSlice.actions
export default uiSlice.reducer
