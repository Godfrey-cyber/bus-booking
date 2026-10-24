import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts'

export default function OccupancyChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(11,11,12,0.06)" vertical={false} />
        <XAxis dataKey="route" tick={{ fontSize: 12, fill: '#6B6D76' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#6B6D76' }} axisLine={false} tickLine={false} width={32} unit="%" />
        <Tooltip
          formatter={(value) => `${value}%`}
          contentStyle={{ borderRadius: 12, border: '1px solid rgba(11,11,12,0.08)', fontSize: 13 }}
        />
        <Bar dataKey="occupancy" radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.occupancy > 75 ? '#0B0B0C' : '#FFC629'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
