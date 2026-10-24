import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../redux/features/auth/authSlice'
import { clearSession } from '../utils/session'

export function useLogout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return () => {
    dispatch(logout())
    clearSession()
    navigate('/')
  }
}
