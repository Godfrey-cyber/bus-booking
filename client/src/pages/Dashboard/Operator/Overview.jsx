import { HiOutlineCalendar, HiOutlineCash, HiOutlineUserGroup, HiOutlineChartBar } from 'react-icons/hi'
import Card from '../../../components/common/Card'
import StatCard from '../../../components/dashboard/StatCard'
import RevenueTrendChart from '../../../components/charts/RevenueTrendChart'
import OccupancyChart from '../../../components/charts/OccupancyChart'
import { OPERATOR_STATS, REVENUE_TREND, OCCUPANCY_BY_ROUTE } from '../../../mock/operatorData'
import { formatCurrency } from '../../../utils/format'

export default function OperatorOverview() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-fleet-black">Operator overview</h1>
      <p className="mt-1 text-sm text-fleet-gray">Today's performance across your fleet.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<HiOutlineCalendar className="h-4.5 w-4.5" />} label="Today's trips" value={OPERATOR_STATS.todayTrips} />
        <StatCard
          icon={<HiOutlineCash className="h-4.5 w-4.5" />}
          label="Today's revenue"
          value={formatCurrency(OPERATOR_STATS.todayRevenue)}
          trend="+12%"
        />
        <StatCard icon={<HiOutlineUserGroup className="h-4.5 w-4.5" />} label="Passengers today" value={OPERATOR_STATS.todayPassengers} />
        <StatCard
          icon={<HiOutlineChartBar className="h-4.5 w-4.5" />}
          label="Bus utilization"
          value={`${Math.round(OPERATOR_STATS.busUtilization * 100)}%`}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="font-display text-sm font-semibold text-fleet-black">Revenue this week</h2>
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
