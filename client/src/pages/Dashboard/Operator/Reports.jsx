import { useState } from 'react'
import Card from '../../../components/common/Card'
import StatCard from '../../../components/dashboard/StatCard'
import RevenueTrendChart from '../../../components/charts/RevenueTrendChart'
import OccupancyChart from '../../../components/charts/OccupancyChart'
import { REVENUE_TREND, OCCUPANCY_BY_ROUTE } from '../../../mock/operatorData'
import { HiOutlineCash, HiOutlineTicket, HiOutlineTrendingDown, HiOutlineTrendingUp } from 'react-icons/hi'
import { formatCurrency } from '../../../utils/format'
import { cn } from '../../../utils/cn'

const PERIODS = [
  { id: 'weekly', label: 'This week' },
  { id: 'monthly', label: 'This month' },
  { id: 'yearly', label: 'This year' },
]

export default function OperatorReports() {
  const [period, setPeriod] = useState('weekly')
  const totalRevenue = REVENUE_TREND.reduce((sum, d) => sum + d.revenue, 0)
  const totalBookings = REVENUE_TREND.reduce((sum, d) => sum + d.bookings, 0)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-fleet-black">Reports & analytics</h1>
          <p className="mt-1 text-sm text-fleet-gray">Revenue, occupancy, and booking trends.</p>
        </div>
        <div className="flex gap-1 rounded-lg bg-fleet-black/5 p-1">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                period === p.id ? 'bg-fleet-white text-fleet-black shadow-sm' : 'text-fleet-gray'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<HiOutlineCash className="h-4.5 w-4.5" />} label="Total revenue" value={formatCurrency(totalRevenue)} trend="+8%" />
        <StatCard icon={<HiOutlineTicket className="h-4.5 w-4.5" />} label="Total bookings" value={totalBookings} trend="+5%" />
        <StatCard icon={<HiOutlineTrendingDown className="h-4.5 w-4.5" />} label="Cancellation rate" value="4.2%" trend="-1.1%" />
        <StatCard icon={<HiOutlineTrendingUp className="h-4.5 w-4.5" />} label="Refund rate" value="2.1%" trend="+0.3%" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="font-display text-sm font-semibold text-fleet-black">Revenue trend</h2>
          <div className="mt-3">
            <RevenueTrendChart data={REVENUE_TREND} />
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="font-display text-sm font-semibold text-fleet-black">Occupancy by route</h2>
          <div className="mt-3">
            <OccupancyChart data={OCCUPANCY_BY_ROUTE} />
          </div>
        </Card>
      </div>
    </div>
  )
}
