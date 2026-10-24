import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  results: [],
  selectedOperatorId: null,
}

const operatorsSlice = createSlice({
  name: 'operators',
  initialState,
  reducers: {
    setResults(state, action) {
      state.results = action.payload
    },
    selectOperator(state, action) {
      state.selectedOperatorId = action.payload
    },
  },
})

export const { setResults, selectOperator } = operatorsSlice.actions
export default operatorsSlice.reducer