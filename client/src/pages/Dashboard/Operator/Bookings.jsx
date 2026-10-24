import { useState } from 'react'
import { HiOutlineCheck } from 'react-icons/hi'
import DataTable from '../../../components/dashboard/DataTable'
import Badge from '../../../components/common/Badge'
import Button from '../../../components/common/Button'
import { OPERATOR_BOOKINGS } from '../../../mock/operatorData'
import { formatCurrency } from '../../../utils/format'
import { useToast } from '../../../hooks/useToast'

const STATUS_TONE = { upcoming: 'info', checked_in: 'success', completed: 'neutral', cancelled: 'error' }
const STATUS_LABEL = { upcoming: 'Upcoming', checked_in: 'Checked in', completed: 'Completed', cancelled: 'Cancelled' }

export default function OperatorBookings() {
  const [bookings, setBookings] = useState(OPERATOR_BOOKINGS)
  console.log("bookings", bookings)
  const toast = useToast()

  const checkIn = (id) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'checked_in' } : b)))
    toast.success('Passenger checked in.')
  }

  const columns = [
    { key: 'passenger', label: 'Passenger' },
    { key: 'reference', label: 'Reference', render: (row) => <span className="font-mono text-xs">{row.reference}</span> },
    { key: 'route', label: 'Route' },
    { key: 'seats', label: 'Seats', render: (row) => row.seats.join(', ') },
    { key: 'amount', label: 'Amount', render: (row) => formatCurrency(row.amount) },
    { key: 'status', label: 'Status', render: (row) => <Badge tone={STATUS_TONE[row.status]}>{STATUS_LABEL[row.status]}</Badge> },
    {
      key: 'actions',
      label: '',
      render: (row) =>
        row.status === 'upcoming' ? (
          <Button size="sm" variant="outline" leftIcon={<HiOutlineCheck className="h-3.5 w-3.5" />} onClick={() => checkIn(row.id)}>
            Check in
          </Button>
        ) : null,
    },
  ]

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-fleet-black">Bookings</h1>
      <p className="mt-1 text-sm text-fleet-gray">Passenger bookings across your fleet.</p>

      <div className="mt-6">
        <DataTable columns={columns} rows={bookings} emptyLabel="No bookings yet" />
      </div>
    </div>
  )
}
