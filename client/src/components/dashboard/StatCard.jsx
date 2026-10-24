import Card from '../common/Card'

export default function StatCard({ icon, label, value, trend }) {
  return (
    <Card className="p-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-fleet-yellow/15 text-fleet-yellow-dark">
        {icon}
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-fleet-black">{value}</p>
      <div className="flex items-center justify-between">
        <p className="text-xs text-fleet-gray">{label}</p>
        {trend && (
          <span className={`text-xs font-medium ${trend.startsWith('-') ? 'text-state-error' : 'text-state-success'}`}>
            {trend}
          </span>
        )}
      </div>
    </Card>
  )
}
