import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { HiMenu, HiX, HiOutlineBell, HiOutlineUserCircle, HiOutlineLogout } from 'react-icons/hi'
import { motion, AnimatePresence } from 'framer-motion'
import Container from '../common/Container'
import Button from '../common/Button'
import { useAuth } from '../../hooks/useAuth'
import { useLogout } from '../../hooks/useLogout'
import { cn } from '../../utils/cn'
import { ROLES } from '../../constants/roles'

const ROLE_HOME = {
    [ROLES.PASSENGER]: '/dashboard',
    [ROLES.OPERATOR]: '/operator',
    [ROLES.ADMIN]: '/admin',
}

const NAV_LINKS = [
  { label: 'Search buses', to: '/search' },
  { label: 'My bookings', to: '/my-bookings' },
  { label: 'Help', to: '/#faq' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, user } = useAuth()
  const logout = useLogout()
  console.log("role", ROLE_HOME[user?.role])
  return (
    <header className="sticky top-0 z-50 border-b border-fleet-black/[0.06] bg-fleet-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-fleet-black">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-fleet-yellow text-fleet-black">
            🚌
          </span>
          FleetGo
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3.5 py-2 text-sm font-medium text-fleet-charcoal hover:bg-fleet-black/5',
                  isActive && 'text-fleet-black font-semibold'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <>
              <button
                aria-label="Notifications"
                className="rounded-full p-2 text-fleet-charcoal hover:bg-fleet-black/5"
              >
                <HiOutlineBell className="h-5 w-5" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen((v) => !v)}
                  aria-expanded={isMenuOpen}
                  className="flex items-center gap-2 rounded-full border border-fleet-black/10 py-1 pl-1 pr-3 text-sm font-medium hover:border-fleet-black/25"
                >
                  <HiOutlineUserCircle className="h-6 w-6 text-fleet-gray" />
                  {/*{user?.first_name?.split(' ')[0]}*/}
                  <p className="hidden md:flex text-xs font-semibold">{user?.role_id == 3 ? user?.company_name : user?.first_name.split(' ')[0]}</p>
                </button>
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-xl border border-fleet-black/[0.06] bg-fleet-white py-1 shadow-lg"
                    >
                      <Link
                        to="/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-3.5 py-2 text-sm text-fleet-charcoal hover:bg-fleet-black/5"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false)
                          logout()
                        }}
                        className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-state-error hover:bg-state-error/5"
                      >
                        <HiOutlineLogout className="h-4 w-4" /> Log out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Button as={Link} to="/login" variant="ghost" size="sm">
                Log in
              </Button>
              {/*<Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm"
              >
                Log in
              </Link>*/}
              <Button as={Link} to="/register" variant="dark" size="sm">
                Sign up
              </Button>
            </>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-fleet-black md:hidden"
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
        </button>
      </Container>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-fleet-black/[0.06] md:hidden"
            aria-label="Mobile"
          >
            <Container className="flex flex-col gap-1 py-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-fleet-charcoal hover:bg-fleet-black/5"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex gap-2 border-t border-fleet-black/[0.06] pt-3">
                {isAuthenticated ? (
                  <> 
                    <Button as={Link} to={`/${ROLE_HOME[user.role]}`} variant="dark" className="flex-1" size="sm">
                      Dashboard
                    </Button>
                    <Button variant="outline" className="flex-1" size="sm" onClick={logout}>
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button as={Link} to="/login" variant="outline" className="flex-1" size="sm">
                      Log in
                    </Button>
                    <Button as={Link} to="/register" variant="dark" className="flex-1" size="sm">
                      Sign up
                    </Button>
                  </>
                )}
              </div>
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
