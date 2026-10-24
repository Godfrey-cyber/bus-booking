import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [], // persisted notification center items (server-driven, later phase)
  toasts: [], // ephemeral UI toasts: [{ id, type, message }]
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    pushToast: {
      reducer(state, action) {
        state.toasts.push(action.payload)
      },
      prepare({ type = 'info', message }) {
        return { payload: { id: Date.now(), type, message } }
      },
    },
    dismissToast(state, action) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload)
    },
    setNotifications(state, action) {
      state.items = action.payload
    },
    markAsRead(state, action) {
      const item = state.items.find((n) => n.id === action.payload)
      if (item) item.read = true
    },
    markAllAsRead(state) {
      state.items.forEach((n) => {
        n.read = true
      })
    },
  },
})

export const { pushToast, dismissToast, setNotifications, markAsRead, markAllAsRead } = notificationsSlice.actions
export default notificationsSlice.reducer
