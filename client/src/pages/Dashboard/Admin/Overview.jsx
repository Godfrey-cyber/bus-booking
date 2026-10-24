import { HiOutlineCash, HiOutlineOfficeBuilding, HiOutlineUserGroup, HiOutlineTicket } from 'react-icons/hi'
import Card from '../../../components/common/Card'
import StatCard from '../../../components/dashboard/StatCard'
import RevenueTrendChart from '../../../components/charts/RevenueTrendChart'
import OccupancyChart from '../../../components/charts/OccupancyChart'
import { ADMIN_STATS, PLATFORM_REVENUE_TREND, OPERATOR_SHARE } from '../../../mock/adminData'

import { formatCurrency } from '../../../utils/format'
import { useAuth } from '../../../hooks/useAuth'

export default function AdminOverview() {
    const { user } = useAuth()
    
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-fleet-black">Platform overview</h1>
      <p className="mt-1 text-sm text-fleet-gray">Revenue, operators, and passenger activity across FleetGo.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<HiOutlineCash className="h-4.5 w-4.5" />} label="Total revenue" value={formatCurrency(ADMIN_STATS.totalRevenue)} trend="+9%" />
        <StatCard icon={<HiOutlineOfficeBuilding className="h-4.5 w-4.5" />} label="Operators" value={ADMIN_STATS.totalOperators} />
        <StatCard icon={<HiOutlineUserGroup className="h-4.5 w-4.5" />} label="Passengers" value={ADMIN_STATS.totalPassengers.toLocaleString()} trend="+4%" />
        <StatCard icon={<HiOutlineTicket className="h-4.5 w-4.5" />} label="Bookings" value={ADMIN_STATS.totalBookings.toLocaleString()} trend="+6%" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="font-display text-sm font-semibold text-fleet-black">Platform revenue this week</h2>
          <div className="mt-3">
            <RevenueTrendChart data={PLATFORM_REVENUE_TREND} />
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="font-display text-sm font-semibold text-fleet-black">Occupancy by top operator</h2>
          <div className="mt-3">
            <OccupancyChart data={OPERATOR_SHARE} />
          </div>
        </Card>
      </div>
    </div>
  )
}
