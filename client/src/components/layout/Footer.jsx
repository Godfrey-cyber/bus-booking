import { Link } from 'react-router-dom'
import { HiOutlineMail } from 'react-icons/hi'
import Container from '../common/Container'
import Button from '../common/Button'

const COLUMNS = [
  {
    title: 'Travel',
    links: [
      { label: 'Search buses', to: '/search' },
      { label: 'My bookings', to: '/my-bookings' },
      { label: 'Refund policy', to: '/#faq' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Why FleetGo', to: '/#why-us' },
      { label: 'Become an operator', to: '/register' },
      { label: 'FAQ', to: '/#faq' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help center', to: '/#faq' },
      { label: 'Contact us', to: '/#footer' },
      { label: 'Terms & conditions', to: '/#footer' },
    ],
  },
]

export default function Footer() {
  return (
    <footer id="footer" className="bg-fleet-black text-fleet-white">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-fleet-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-fleet-yellow text-fleet-black">
                🚌
              </span>
              FleetGo
            </Link>
            <p className="mt-3 max-w-xs text-sm text-white/60">
              Book intercity bus tickets in minutes — compare operators, pick your seat, travel with confidence.
            </p>
            <div className="mt-5 flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                aria-label="Email for newsletter"
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-fleet-yellow focus:outline-none"
              />
              <Button variant="primary" size="sm" leftIcon={<HiOutlineMail className="h-4 w-4" />}>
                Join
              </Button>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-semibold text-white/90">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-white/60 hover:text-fleet-yellow">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} FleetGo. All rights reserved.</p>
          <p className="font-mono">Made for travelers, by travelers.</p>
        </div>
      </Container>
    </footer>
  )
}
