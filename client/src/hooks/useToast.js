import { useDispatch } from 'react-redux'
import { pushToast, dismissToast } from '../redux/features/notifications/notificationsSlice'

// Thin wrapper so components can fire toasts without importing action creators directly.
export function useToast() {
  const dispatch = useDispatch()
  return {
    success: (message) => dispatch(pushToast({ type: 'success', message })),
    error: (message) => dispatch(pushToast({ type: 'error', message })),
    info: (message) => dispatch(pushToast({ type: 'info', message })),
    dismiss: (id) => dispatch(dismissToast(id)),
  }
}
