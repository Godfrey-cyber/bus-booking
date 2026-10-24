import { useState } from 'react'
import { HiOutlineEmojiSad } from 'react-icons/hi'
import Container from '../../components/common/Container'
import BookingCard from '../../components/booking/BookingCard'
import Skeleton from '../../components/common/Skeleton'
import EmptyState from '../../components/common/EmptyState'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { cn } from '../../utils/cn'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { useGetMyBookingsQuery, useCancelBookingMutation, useRequestRefundMutation } from '../../redux/services/bookingApi'

const TABS = [
  { id: 'pending', label: 'Pending' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'refunded', label: 'Refunded' },
]

export default function MyBookingsPage() {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState('pending')
    const [cancelTarget, setCancelTarget] = useState(null)
    const [refundTarget, setRefundTarget] = useState(null)
    const toast = useToast()
    
    const { data: bookings, isLoading } = useGetMyBookingsQuery({ 
        bookingID: user?._id, 
        page: 1, 
        limit: 20,
        status: activeTab 
    }, { skip: !user?._id })

  console.log("My booking page bookings", bookings)

  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation()
  const [requestRefund, { isLoading: isRequestingRefund }] = useRequestRefundMutation()

  const filtered = bookings?.filter((b) => b?.status === activeTab) ?? []

  const handleCancelConfirm = async () => {
    const result = await cancelBooking({ bookingId: cancelTarget.id, reason: 'Passenger requested cancellation' })
    if (!result?.error) {
      toast.success('Booking cancelled. A cancellation fee may apply per fare rules.')
      setCancelTarget(null)
    }
  }

  const handleRefundConfirm = async () => {
    const result = await requestRefund({ bookingId: refundTarget.id, reason: 'Passenger requested refund' })
    if (!result?.error) {
      toast.success('Refund request submitted — you can track its status from this page.')
      setRefundTarget(null)
    }
  }

  return (
    <Container className="py-6 sm:py-8">
      <h1 className="font-display text-2xl font-bold text-fleet-black">My bookings</h1>
      <p className="mt-1 text-sm text-fleet-gray">Manage upcoming trips, tickets, cancellations, and refunds.</p>

      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-fleet-black/[0.06] scrollbar-none">
        {TABS?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={cn(
              'shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'border-fleet-yellow-dark text-fleet-black'
                : 'border-transparent text-fleet-gray hover:text-fleet-charcoal'
            )}
          >
            {tab?.label}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {isLoading &&
          Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)}

        {!isLoading && filtered?.length === 0 && (
          <EmptyState
            icon={<HiOutlineEmojiSad />}
            title={`No ${activeTab} bookings`}
            description="Trips you book will show up here."
          />
        )}

        {!isLoading &&
          filtered?.map((booking) => (
            <BookingCard
              key={booking?.id}
              booking={booking}
              onCancel={setCancelTarget}
              onRefund={setRefundTarget}
            />
            // <div key={booking?.id} className="mt-6 flex flex-col gap-4">
            //     <p className="font-mono text-xs text-fleet-gray">{booking.booking_reference}</p>
            //     <p className="font-mono text-xs text-fleet-gray">{booking.status}</p>
            //     <p className="font-mono text-xs text-fleet-gray">{booking.total_amount}</p>
            // </div>
          ))}
      </div>

      <ConfirmDialog
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancelConfirm}
        title="Cancel this booking?"
        description="A cancellation fee may apply based on the operator's fare rules. This can't be undone."
        confirmLabel="Cancel booking"
        isDangerous
        isLoading={isCancelling}
      />

      <ConfirmDialog
        isOpen={!!refundTarget}
        onClose={() => setRefundTarget(null)}
        onConfirm={handleRefundConfirm}
        title="Request a refund?"
        description="We'll review your request against the fare rules for this trip and update the status here."
        confirmLabel="Submit request"
        isLoading={isRequestingRefund}
      />
    </Container>
  )
}
