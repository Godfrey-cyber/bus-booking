import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { formatCurrency } from '../../utils/format'

export default function RevenueTrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFC629" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#FFC629" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(11,11,12,0.06)" vertical={false} />
        <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#6B6D76' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#6B6D76' }} axisLine={false} tickLine={false} width={40} />
        <Tooltip
          formatter={(value) => formatCurrency(value)}
          contentStyle={{ borderRadius: 12, border: '1px solid rgba(11,11,12,0.08)', fontSize: 13 }}
        />
        <Area type="monotone" dataKey="revenue" stroke="#E6AD0E" strokeWidth={2} fill="url(#revenueFill)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
