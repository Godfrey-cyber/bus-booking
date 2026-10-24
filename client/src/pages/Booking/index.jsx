import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { HiStar, HiOutlineLocationMarker, HiOutlineClock, HiOutlineEmojiSad } from 'react-icons/hi'
import { GiPathDistance } from "react-icons/gi";
import Container from '../../components/common/Container'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Skeleton from '../../components/common/Skeleton'
import EmptyState from '../../components/common/EmptyState'
import { useGetBusByIdQuery } from '../../redux/services/busesApi'
import { useGetTripByIdQuery } from '../../redux/services/tripsApi'
import { startBooking } from '../../redux/features/cart/cartSlice'
import { selectCurrentUser, selectAccessToken } from '../../redux/features/auth/authSlice'
import { formatCurrency, formatDate, formatTime, formatDuration } from '../../utils/format'
import { AMENITY_LABELS } from '../../mock/buses'
import { useAuth } from '../../hooks/useAuth'

import { useSearchSeatsQuery } from '../../redux/services/seatsApi'

const BookingPage = () => {
    const { trip_id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { isAuthenticated, user } = useAuth()
    const { data: trip, isLoading, isError } = useGetTripByIdQuery(trip_id)
  
    const bus_id = trip?.[0]?.bus_id;
    const { data: seats, isLoading: isSeatLoading, isError: isSeatError } = useSearchSeatsQuery(
        { trip_id, bus_id },
        { skip: !trip_id || !bus_id }
    );

    console.log("user booking", user);
    console.log("seats ", seats);
    console.log("trip ", trip)

    console.log("trip_id ", trip_id)
    console.log("bus_id ", bus_id)

    const handleSelectSeats = () => {
        dispatch(startBooking({ trip_id }))
        navigate(isAuthenticated ? `/booking/${trip_id}/seats/${bus_id}` : '/login', {
            state: !isAuthenticated ? { from: { pathname: `/booking/${trip_id}/seats/${bus_id}` } } : undefined,
        })
    }

    if (isLoading) {
        return (
            <Container className="py-8">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="mt-4 h-48 w-full rounded-2xl" />
            </Container>
        )
    }

    if (isError || !trip?.[0].bus_id) {
        return (
            <Container className="py-8">
                <EmptyState
                    icon={<HiOutlineEmojiSad />}
                    title={`Bus not found with ${trip?.[0].bus_id}.`}
                    description={`${trip_id}: This trip may no longer be available.`}
                    actionLabel="Back to search."
                    onAction={() => navigate('/search')}
                />
            </Container>
        )
    }

    const availableSeats = seats?.filter((s) => s.status === 'available').length
    console.log("availableSeats", availableSeats)

    return (
        <div className="py-6 sm:py-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="flex flex-col gap-5">
             <Card className="p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-fleet-yellow/15 font-display font-bold text-fleet-yellow-dark">
                      {trip?.[0].operator_name.charAt(0)}
                    </div>
                    <div>
                      <h1 className="font-display text-lg font-bold text-fleet-black">{trip?.[0].operator_name}</h1>
                      <p className="flex items-center gap-1 text-sm text-fleet-gray">
                        <HiStar className="h-4 w-4 text-fleet-yellow-dark" /> {trip?.[0].rating_avg} rating
                      </p>
                    </div>
                  </div>
                  <Badge tone={availableSeats > 10 ? 'success' : availableSeats > 0 ? 'warning' : 'error'}>
                    {availableSeats > 0 ? `${availableSeats} seats left` : 'Sold out'}
                  </Badge>
                </div>

                <div className="mt-6 flex items-center gap-6 border-y border-fleet-black/[0.06] py-5">
                  <div>
                    <p className="font-display text-2xl font-bold text-fleet-black">{formatTime(trip?.[0].departure_time)}</p>
                    <p className="text-sm text-fleet-gray">{trip?.[0].origin}</p>
                    <p className="text-xs text-fleet-gray">{formatDate(trip?.[0].departure_time)}</p>
                  </div>
                  <div className="flex flex-1 flex-col items-center text-fleet-gray">
                    <span className="flex items-center gap-1 text-xs">
                      <HiOutlineClock className="h-3.5 w-3.5" /> {formatDuration(trip?.[0].duration_minutes)}
                    </span>
                    <div className="mt-1 h-px w-full bg-fleet-black/10" />
                    <span className="flex items-center gap-1 text-xs">
                        <GiPathDistance className="h-3.5 w-3.5" /> {trip?.[0].distance} km
                      </span>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl font-bold text-fleet-black">{formatTime(trip?.[0].arrival_time)}</p>
                    <p className="text-sm text-fleet-gray">{trip?.[0].destination}</p>
                    <p className="text-xs text-fleet-gray">{formatDate(trip?.[0].arrival_time)}</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <HiOutlineLocationMarker className="mt-0.5 h-4 w-4 shrink-0 text-fleet-yellow-dark" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-fleet-gray">Boarding point</p>
                      <p className="text-sm text-fleet-charcoal">{trip?.[0].boarding_point}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <HiOutlineLocationMarker className="mt-0.5 h-4 w-4 shrink-0 text-fleet-yellow-dark" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-fleet-gray">Arrival point</p>
                      <p className="text-sm text-fleet-charcoal">{trip?.[0].arrival_point}</p>
                    </div>
                  </div>
                </div>

                {trip?.[0].amenities.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {trip[0]?.amenities.map((a) => (
                      <Badge key={a} tone="yellow">
                        {[a]}
                        {AMENITY_LABELS[a]}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            <div>
              <Card className="sticky top-24 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-fleet-gray">Fare per seat</p>
                <p className="mt-1 font-display text-3xl font-bold text-fleet-black">{formatCurrency(trip?.[0]?.price)}</p>
                <p className="mt-1 text-xs text-fleet-gray">Final price confirmed at checkout, before payment.</p>
                <Button
                  size="lg"
                  className="mt-5 w-full"
                  disabled={availableSeats === 0}
                  onClick={handleSelectSeats}
                >
                  Select seats
                </Button>
              </Card>
            </div>
          </div>
        </div>
    )
}

export default BookingPage