import { Link, useParams } from 'react-router-dom'
import { HiOutlineTicket, HiOutlineHeart, HiOutlineUserGroup, HiArrowRight, HiOutlineCalendar } from 'react-icons/hi'
import Card from '../../../components/common/Card'
import Button from '../../../components/common/Button'
import Skeleton from '../../../components/common/Skeleton'
import { useAuth } from '../../../hooks/useAuth'
import { useGetMyBookingsQuery, useGetAllBookingsQuery } from '../../../redux/services/bookingApi'
import { formatCurrency, formatDate, formatTime } from '../../../utils/format'

export default function PassengerOverview() {
    const { user, role } = useAuth()
    // const { bus_id } = useParams()
    console.log("hello")
    const { data: bookings, isLoading } = useGetMyBookingsQuery({ 
        bookingID: user?._id, 
        page: 1, 
        limit: 20
        // status: activeTab 
    }, { skip: !user?._id });

    console.log("Passenger Overview", user)
    console.log("Passenger Overview", role)
    console.log(bookings)
    console.log(isLoading)

    const pending = bookings?.filter((b) => b.status === 'pending') ?? []
    const completed = bookings?.filter((b) => b.status === 'completed') ?? []
    const cancelled = bookings?.filter((b) => b.status === 'cancelled') ?? []
    const confirmed = bookings?.filter((b) => b.status === 'confirmed') ?? []
    const refunded = bookings?.filter((b) => b.status === 'refunded') ?? []
    // const nextTrip = upcoming[0]
    const nextTrip = bookings?.filter((b) => b?.status === 'confirmed') ?? []
    console.log("nextTrip", nextTrip)

    const STATS = [
        { label: 'Pending trips', value: pending.length, icon: <HiOutlineCalendar className="h-4.5 w-4.5" /> },
        { label: 'Completed trips', value: completed.length, icon: <HiOutlineTicket className="h-4.5 w-4.5" /> },
        { label: 'Saved travelers', value: 2, icon: <HiOutlineUserGroup className="h-4.5 w-4.5" /> },
        { label: 'Favorite routes', value: 2, icon: <HiOutlineHeart className="h-4.5 w-4.5" /> },
    ]

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-fleet-black">Welcome back, {user?.first_name?.split(' ')[0]}</h1>
      <p className="mt-1 text-sm text-fleet-gray">Here's what's happening with your trips.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-fleet-yellow/15 text-fleet-yellow-dark">
              {stat.icon}
            </div>
            <p className="mt-3 font-display text-2xl font-bold text-fleet-black">{stat.value}</p>
            <p className="text-xs text-fleet-gray">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold text-fleet-black">Next trip</h2>
            <Link to="/my-bookings" className="flex items-center gap-1 text-xs font-medium text-fleet-yellow-dark hover:underline">
              All bookings <HiArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {isLoading && <Skeleton className="mt-4 h-24 w-full rounded-xl" />}

          {!isLoading && !nextTrip && (
            <div className="mt-4 rounded-xl border border-dashed border-fleet-black/15 p-6 text-center">
              <p className="text-sm text-fleet-gray">No upcoming trips yet.</p>
              <Button as={Link} to="/search" size="sm" className="mt-3">
                Search buses
              </Button>
            </div>
          )}

          {!isLoading && nextTrip && (
            nextTrip?.map((trip) => (
                <div className="mt-4 rounded-xl bg-fleet-light/60 p-4">
                    <div className="flex items-center justify-between">
                        <p className="font-display font-semibold text-fleet-black">{trip.operator_name}</p>
                        <span className="font-mono text-xs text-fleet-gray">{trip.booking_reference}</span>
                    </div>
                    <p className="mt-1 text-sm text-fleet-charcoal">
                    {trip.boarding_point} → {trip.arrival_point}
                    </p>
                    <p className="mt-1 text-xs text-fleet-gray">
                        {formatDate(trip.departure_time)} · {formatTime(trip.arrival_time)} · Seats{' '}
                        {trip.bus_seat_id}
                    </p>
                    <Button as={Link} to={`/tickets/${trip.id}`} size="sm" variant="dark" className="mt-3">
                        View ticket
                    </Button>
                </div>
            ))
          )}
        </Card>

        <Card className="p-5">
          <h2 className="font-display text-sm font-semibold text-fleet-black">Quick links</h2>
          <div className="mt-4 flex flex-col gap-2">
            <Link to="/search" className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-fleet-charcoal hover:bg-fleet-black/5">
              Search buses <HiArrowRight className="h-3.5 w-3.5 text-fleet-gray" />
            </Link>
            <Link to="/dashboard/saved-travelers" className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-fleet-charcoal hover:bg-fleet-black/5">
              Saved travelers <HiArrowRight className="h-3.5 w-3.5 text-fleet-gray" />
            </Link>
            <Link to="/dashboard/favorite-routes" className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-fleet-charcoal hover:bg-fleet-black/5">
              Favorite routes <HiArrowRight className="h-3.5 w-3.5 text-fleet-gray" />
            </Link>
            <Link to="/dashboard/profile" className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-fleet-charcoal hover:bg-fleet-black/5">
              Edit profile <HiArrowRight className="h-3.5 w-3.5 text-fleet-gray" />
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
