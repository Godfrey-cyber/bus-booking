import { useState } from 'react'
import DataTable from '../../../components/dashboard/DataTable'
import Badge from '../../../components/common/Badge'
import { ADMIN_BOOKINGS } from '../../../mock/adminData'
import { formatCurrency, formatDate } from '../../../utils/format'
import { cn } from '../../../utils/cn'
import { useGetAllBookingsQuery } from '../../../redux/services/bookingApi'

const STATUS_TONE = { pending: 'info', completed: 'success', confirmed: 'success', cancelled: 'error', refunded: 'warning' }
const TABS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'refunded', label: 'Refunded' },
]

const AdminBookings = () => {
  const [tab, setTab] = useState('all')
  const { data: bookings, isLoading } = useGetAllBookingsQuery({ 
      page: 1, 
      limit: 20,
      status: tab
  });

  console.log("bookings", bookings)
  console.log("tab", tab)

  const rows = tab === 'all' ? bookings : bookings?.filter((b) => b.status === tab)

  const columns = [
    { key: 'booking_reference', label: 'Reference', render: (row) => <span className="font-mono text-xs">{row.booking_reference}</span> },
    { key: 'first_name', label: 'Passenger' },
    { key: 'operator', label: 'Operator' },
    { key: 'route', label: 'Route' },
    { key: 'total_amount', label: 'Amount', render: (row) => formatCurrency(row.total_amount) },
    { key: 'created_at', label: 'Booked on', render: (row) => formatDate(row.created_at) },
    { key: 'status', label: 'Status', render: (row) => <Badge tone={STATUS_TONE[row.status]}>{row.status}</Badge> },
  ]

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-fleet-black">Bookings</h1>
      <p className="mt-1 text-sm text-fleet-gray">Every booking placed across all operators.</p>

      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-fleet-black/[0.06] scrollbar-none">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
              tab === t.id ? 'border-fleet-yellow-dark text-fleet-black' : 'border-transparent text-fleet-gray hover:text-fleet-charcoal'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <DataTable columns={columns} rows={rows} emptyLabel="No bookings match this filter" />
      </div>
    </div>
  )
}
export default AdminBookings;