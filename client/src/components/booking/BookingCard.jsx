import { useNavigate } from "react-router-dom"
import { HiOutlineTicket, HiOutlineCalendar, HiOutlineLocationMarker } from 'react-icons/hi'
import Card from '../common/Card'
import Badge from '../common/Badge'
import Button from '../common/Button'
import { formatCurrency, formatDate, formatTime } from '../../utils/format'

const STATUS_TONE = {
  pending: 'info',
  completed: 'success',
  cancelled: 'error',
  refunded: 'warning',
  confirmed: 'info',
}

const STATUS_LABEL = {
  pending: 'Pending',
  completed: 'Completed',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
  confirmed: 'Confirmed',
}

const BookingCard = ({ booking, onCancel, onRefund }) => {
  const navigate = useNavigate()

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-sm font-semibold text-fleet-black">{booking?.bus?.operator}</p>
          <p className="flex items-center gap-1 text-sm text-fleet-gray">
            <HiOutlineLocationMarker className="h-3.5 w-3.5" />
            {booking?.boarding_point} → {booking?.arrival_point}
          </p>
        </div>
        <Badge tone={STATUS_TONE[booking?.status]}>{STATUS_LABEL[booking?.status]}</Badge>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-fleet-charcoal">
        <span className="flex items-center gap-1.5">
          <HiOutlineCalendar className="h-4 w-4 text-fleet-yellow-dark" />
          {formatDate(booking?.trip_date)} · {formatTime(booking?.departure_time)}
        </span>
        <span className="font-mono text-xs text-fleet-gray">Ref {booking?.booking_reference}</span>
        <span className="text-xs text-fleet-gray">Seats {booking?.bus_seat_id}</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-fleet-black/[0.06] pt-4">
        <div className="text-sm">
          <span className="text-fleet-gray">
            {booking?.status === 'refunded' ? 'Refunded' : booking?.status === 'cancelled' ? 'Paid (before fee)' : 'Total paid'}
          </span>{' '}
          <span className="font-semibold text-fleet-black">
            {formatCurrency(booking?.status === 'refunded' ? booking?.refundedAmount : booking?.total_amount)}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {(booking?.status === 'pending' || booking?.status === 'completed') && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<HiOutlineTicket className="h-4 w-4" />}
              onClick={() => navigate(`/tickets/${booking?.id}`)}
            >
              View ticket
            </Button>
          )}
          {booking?.status === 'pending' && (
            <>
              <Button variant="outline" size="sm" onClick={() => onRefund?.(booking)}>
                Request refund
              </Button>
              <Button variant="danger" size="sm" onClick={() => onCancel?.(booking)}>
                Cancel
              </Button>
            </>
          )}
          {(booking?.status === 'completed' || booking?.status === 'cancelled') && (
            <Button variant="ghost" size="sm" onClick={() => navigate(`/buses/${booking?.bus.id}`)}>
              Rebook
            </Button>
          )}
        </div>
      </div>
    </Card>

  )
}
export default BookingCard 