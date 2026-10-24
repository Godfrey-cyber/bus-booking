import { Link, NavLink, Outlet } from 'react-router-dom'
import { HiOutlineLogout } from 'react-icons/hi'
import Toaster from '../components/common/Toaster'
import Container from '../components/common/Container'
import { useAuth } from '../hooks/useAuth'
import { useLogout } from '../hooks/useLogout'
import { cn } from '../utils/cn'

// Shared shell for Passenger / Operator / Admin dashboards.
// `navItems` is supplied per-role by the route config so this stays role-agnostic.
export default function DashboardLayout({ navItems = [], title = 'Dashboard' }) {
  const { user } = useAuth()
  const logout = useLogout()

  return (
    <div className="min-h-screen bg-fleet-light">
      <div className="flex">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-fleet-black/[0.06] bg-fleet-white p-4 md:flex">
          <Link to="/" className="flex items-center gap-2 px-2 pb-5 font-display text-lg font-bold text-fleet-black">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-fleet-yellow text-fleet-black text-sm">
              🚌
            </span>
            {title}
          </Link>
          <nav className="flex flex-1 flex-col gap-1" aria-label="Dashboard">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-fleet-charcoal hover:bg-fleet-black/5',
                    isActive && 'bg-fleet-yellow/15 text-fleet-black font-semibold'
                  )
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-4 border-t border-fleet-black/[0.06] pt-3">
            <p className="truncate px-3 text-sm font-medium text-fleet-black">{user?.name}</p>
            <p className="truncate px-3 text-xs text-fleet-gray">{user?.email}</p>
            <button
              onClick={logout}
              className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-state-error hover:bg-state-error/5"
            >
              <HiOutlineLogout className="h-4 w-4" /> Log out
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 py-8">
          <Container>
            <Outlet />
          </Container>
        </main>
      </div>
      <Toaster />
    </div>
  )
}
