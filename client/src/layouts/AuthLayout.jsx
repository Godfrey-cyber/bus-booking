import { Link, Outlet } from 'react-router-dom'
import Toaster from '../components/common/Toaster'

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-fleet-black p-10 text-fleet-white lg:flex">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-fleet-yellow text-fleet-black">
            🚌
          </span>
          FleetGo
        </Link>
        <div className="ticket-perforation h-6 w-full opacity-20" />
        <blockquote className="max-w-md">
          <p className="font-display text-2xl font-medium leading-snug">
            “Booking took two minutes and the seat map made the whole trip feel planned out.”
          </p>
          <footer className="mt-4 text-sm text-white/50">— A FleetGo passenger</footer>
        </blockquote>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
      <Toaster />
    </div>
  )
}
