import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROUTES } from '../constants/routes'

// Gate for routes restricted to specific roles (operator/admin dashboards, etc).
export default function RoleRoute({ allowedRoles = [] }) {
  const { role } = useAuth()
  console.log(" ---  ", role)

  if (!allowedRoles.includes(role)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />
  }
  return <Outlet />
}
