// Platform-wide mock data for the admin dashboard.
export const ADMIN_STATS = {
  totalRevenue: 4820000,
  totalOperators: 12,
  totalPassengers: 8340,
  totalBookings: 15210,
}

export const PLATFORM_REVENUE_TREND = [
  { day: 'Mon', revenue: 320000, bookings: 210 },
  { day: 'Tue', revenue: 298000, bookings: 195 },
  { day: 'Wed', revenue: 341000, bookings: 228 },
  { day: 'Thu', revenue: 402000, bookings: 260 },
  { day: 'Fri', revenue: 512000, bookings: 331 },
  { day: 'Sat', revenue: 618000, bookings: 402 },
  { day: 'Sun', revenue: 455000, bookings: 289 },
]

export const OPERATOR_SHARE = [
  { route: 'Coast Riders', occupancy: 82 },
  { route: 'Savannah Exp.', occupancy: 71 },
  { route: 'Rift Valley', occupancy: 64 },
  { route: 'Northline', occupancy: 48 },
]

export const ADMIN_OPERATORS = [
  { id: 'aop1', name: 'Coast Riders', email: 'ops@coastriders.co.ke', buses: 3, rating: 4.7, status: 'active', joinedAt: '2025-02-11' },
  { id: 'aop2', name: 'Savannah Express', email: 'contact@savannahexpress.co.ke', buses: 5, rating: 4.5, status: 'active', joinedAt: '2025-04-02' },
  { id: 'aop3', name: 'Rift Valley Shuttle', email: 'hello@riftvalleyshuttle.co.ke', buses: 2, rating: 4.6, status: 'active', joinedAt: '2025-06-19' },
  { id: 'aop4', name: 'Northline Coaches', email: 'info@northline.co.ke', buses: 4, rating: 4.3, status: 'suspended', joinedAt: '2025-08-30' },
]

export const ADMIN_BOOKINGS = [
  { id: 'abk1', reference: 'FG-8X29QK', passenger: 'Faith Njeri', operator: 'Coast Riders', route: 'Nairobi → Mombasa', amount: 3000, status: 'upcoming', createdAt: '2026-07-20' },
  { id: 'abk2', reference: 'FG-4L10RS', passenger: 'Kevin Mutua', operator: 'Savannah Express', route: 'Nairobi → Kisumu', amount: 1350, status: 'completed', createdAt: '2026-06-02' },
  { id: 'abk3', reference: 'FG-9P73WD', passenger: 'Grace Achieng', operator: 'Rift Valley Shuttle', route: 'Nairobi → Eldoret', amount: 2200, status: 'completed', createdAt: '2026-05-14' },
  { id: 'abk4', reference: 'FG-2Z55HN', passenger: 'Samuel Kiptoo', operator: 'Northline Coaches', route: 'Nairobi → Mombasa', amount: 1500, status: 'cancelled', createdAt: '2026-05-10' },
]

export const ADMIN_PAYMENTS = [
  { id: 'apay1', reference: 'FG-8X29QK', method: 'mpesa', amount: 3000, status: 'success', createdAt: '2026-07-20' },
  { id: 'apay2', reference: 'FG-4L10RS', method: 'card', amount: 1350, status: 'success', createdAt: '2026-06-02' },
  { id: 'apay3', reference: 'FG-9P73WD', method: 'wallet', amount: 2200, status: 'success', createdAt: '2026-05-14' },
  { id: 'apay4', reference: 'FG-2Z55HN', method: 'card', amount: 1500, status: 'refunded', createdAt: '2026-05-10' },
  { id: 'apay5', reference: 'FG-1Q88BN', method: 'mpesa', amount: 1800, status: 'failed', createdAt: '2026-04-15' },
]

export const ADMIN_REFUNDS = [
  {
    id: 'aref1',
    reference: 'FG-2Z55HN',
    passenger: 'Samuel Kiptoo',
    amount: 1500,
    reason: 'Trip rescheduled by operator',
    status: 'pending',
    timeline: [{ status: 'pending', note: 'Refund requested by passenger', at: '2026-05-10T09:00:00' }],
  },
  {
    id: 'aref2',
    reference: 'FG-1Q88BN',
    passenger: 'Brian Otieno',
    amount: 1800,
    reason: 'Duplicate booking',
    status: 'approved',
    timeline: [
      { status: 'pending', note: 'Refund requested by passenger', at: '2026-04-15T11:00:00' },
      { status: 'approved', note: 'Approved by admin — duplicate confirmed', at: '2026-04-16T08:30:00' },
    ],
  },
]

export const SUPPORT_TICKETS = [
  {
    id: 'st1',
    subject: 'Payment deducted but booking not confirmed',
    user: 'Faith Njeri',
    priority: 'high',
    status: 'open',
    createdAt: '2026-08-01T10:00:00',
    replies: [{ from: 'Faith Njeri', message: 'M-Pesa deducted KES 3,000 but I have no ticket.', at: '2026-08-01T10:00:00' }],
  },
  {
    id: 'st2',
    subject: 'Wrong boarding point listed',
    user: 'Kevin Mutua',
    priority: 'medium',
    status: 'in_progress',
    createdAt: '2026-07-28T14:20:00',
    replies: [
      { from: 'Kevin Mutua', message: 'The app shows River Road but the operator says Accra Road.', at: '2026-07-28T14:20:00' },
      { from: 'Support', message: 'Checking with the operator now, will update shortly.', at: '2026-07-28T15:05:00' },
    ],
  },
  {
    id: 'st3',
    subject: 'Refund taking longer than expected',
    user: 'Samuel Kiptoo',
    priority: 'low',
    status: 'resolved',
    createdAt: '2026-05-12T09:00:00',
    replies: [
      { from: 'Samuel Kiptoo', message: 'Its been 3 days since my refund was approved.', at: '2026-05-12T09:00:00' },
      { from: 'Support', message: 'Refund has now been completed — apologies for the delay.', at: '2026-05-13T10:00:00' },
    ],
  },
]

export const AUDIT_LOGS = [
  { id: 'log1', actor: 'admin@demo.com', action: 'operator.suspended', entity: 'Northline Coaches', at: '2026-08-05T09:12:00' },
  { id: 'log2', actor: 'admin@demo.com', action: 'refund.approved', entity: 'FG-1Q88BN', at: '2026-04-16T08:30:00' },
  { id: 'log3', actor: 'operator@demo.com', action: 'bus.updated', entity: 'KDA 221B', at: '2026-07-15T13:45:00' },
  { id: 'log4', actor: 'system', action: 'payment.webhook_failed', entity: 'FG-2Z55HN', at: '2026-05-10T09:05:00' },
]
