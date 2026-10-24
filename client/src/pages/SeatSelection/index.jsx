import { useEffect } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { HiOutlineClock, HiOutlineEmojiSad } from 'react-icons/hi'
import Container from '../../components/common/Container'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Skeleton from '../../components/common/Skeleton'
import EmptyState from '../../components/common/EmptyState'
import SeatMap from '../../components/seats/SeatMap'
import SeatLegend from '../../components/seats/SeatLegend'
import { useGetBusByIdQuery } from '../../redux/services/busesApi'
import { useGetTripByIdQuery } from '../../redux/services/tripsApi'
import { useSearchSeatsQuery } from '../../redux/services/seatsApi'
import { toggleSeat, setReservationExpiry, clearCart, selectSeatTotal } from '../../redux/features/cart/cartSlice'
import { useCountdown } from '../../hooks/useCountdown'
import { useToast } from '../../hooks/useToast'
import { formatCurrency } from '../../utils/format'

const RESERVATION_MINUTES = 10

const SeatSelectionPage = () => {
    const { trip_id, bus_id } = useParams()
    const tripID = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const toast = useToast()

    const { data: trip, isLoading, isError } = useGetTripByIdQuery(trip_id)

    const { data: seats, isLoading: isSeatLoading, isError: isSeatError } = useSearchSeatsQuery(
        { trip_id, bus_id },
        { skip: !trip_id || !bus_id } // Prevents query from running when bus_id is undefined
    );

    console.log(trip_id, bus_id)

    const selectedSeats = useSelector((state) => state?.cart.selectedSeats || [])
    const reservationExpiresAt = useSelector((state) => state?.cart.reservationExpiresAt)
    const total = useSelector(selectSeatTotal)
    const countdown = useCountdown(reservationExpiresAt)

    console.log("trip",trip);
    console.log("seats ", seats);
    console.log("tripID ", tripID);
    // console.log("selectedSeats", selectedSeats);
    // console.log("reservationExpiresAt", reservationExpiresAt);
    // console.log("total", total);
    console.log("isError", isError);
    console.log("isSeatError", isSeatError);

    useEffect(() => {
        if (reservationExpiresAt && countdown?.isExpired) {
            toast.error('Your seat hold expired. Please choose your seats again.')
            dispatch(clearCart())
            if (trip?.bus_id) {
                navigate(`/buses/${trip?.[0]?.bus_id}`, { replace: true })
            }
        }
    }, [countdown?.isExpired, reservationExpiresAt, trip?.[0]?.bus_id, dispatch, navigate, trip_id, toast])

    const handleToggle = (seat) => {
        if (!trip?.[0]) return

        const isSelecting = !selectedSeats?.some((s) => s?.seat_number === seat?.seat_number)
        dispatch(toggleSeat({ seat_number: seat?.seat_number, price: trip?.[0]?.price }))

        if (isSelecting && selectedSeats?.length === 0) {
            const expiry = new Date(Date.now() + RESERVATION_MINUTES * 60 * 1000).toISOString()
            dispatch(setReservationExpiry(expiry))
        }
    }

    const handleContinue = () => {
        navigate(`/booking/${trip_id}/checkout`)
    }

    if (isLoading) {
        return (
            <Container className="py-8">
                <Skeleton className="h-8 w-56" />
                <Skeleton className="mt-4 h-96 w-full rounded-2xl" />
            </Container>
        )
    }

    if (isError || !trip?.[0]) {
        return (
            <Container className="py-8">
            <EmptyState
                icon={<HiOutlineEmojiSad />}
                title={`Bus not found with ${trip?.[0]?.bus_id}.`}
                description={`${trip_id}: This trip may no longer be available.`}
                actionLabel="Back to search."
                onAction={() => navigate('/search')}
            />
            </Container>
        )
    }

    return (
        <Container className="py-6 sm:py-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-xl font-bold text-fleet-black sm:text-2xl">Choose your seats</h1>
              <p className="text-sm text-fleet-gray">
                {trip?.[0]?.origin} · {trip?.[0]?.boarding_point} → {trip?.[0]?.destination} · {trip?.[0]?.arrival_point}
              </p>
            </div>
            {trip?.[0]?.hold_expires_at && (
              <Badge tone={countdown?.minutes < 2 ? 'error' : 'warning'} className="gap-1.5 text-sm">
                <HiOutlineClock className="h-3.5 w-3.5" /> Seats held — {countdown?.label}
              </Badge>
            )}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="flex flex-col gap-4">
              <SeatLegend />
              <SeatMap
                seatMap={seats}
                selectedSeatNumbers={selectedSeats?.map((s) => s?.seat_number)}
                onToggle={handleToggle}
              />
            </div>

            <Card className="sticky top-24 h-fit p-5">
              <h2 className="font-display text-sm font-semibold text-fleet-black">Seat summary</h2>
              {selectedSeats?.length === 0 ? (
                <p className="mt-3 text-sm text-fleet-gray">Tap available seats to select them.</p>
              ) : (
                <ul className="mt-3 flex flex-col gap-2">
                  {selectedSeats?.map((seat) => (
                    <li key={seat?.seat_number} className="flex items-center justify-between text-sm">
                      <span className="font-mono text-fleet-charcoal">Seat {seat?.seat_number}</span>
                      <span className="text-fleet-gray">{formatCurrency(seat?.price)}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-4 flex items-center justify-between border-t border-fleet-black/[0.06] pt-4">
                <span className="text-sm font-semibold text-fleet-black">Total</span>
                <span className="font-display text-lg font-bold text-fleet-black">{formatCurrency(total)}</span>
              </div>
              <Button className="mt-5 w-full" size="lg" disabled={selectedSeats?.length === 0} onClick={handleContinue}>
                Continue to passenger details
              </Button>
            </Card>
          </div>
        </Container>
    )
    
}
export default SeatSelectionPage