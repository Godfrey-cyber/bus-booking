import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../redux/features/auth/authSlice'
import { readSession } from '../utils/session'

// Rehydrates auth state from a persisted session on first load, so a refresh
// doesn't drop the user back to the login screen.
export function useSessionRestore() {
  const dispatch = useDispatch()

  useEffect(() => {
    const session = readSession()
    if (session?.token) {
      dispatch(setCredentials(session))
    }
  }, [dispatch])
}
