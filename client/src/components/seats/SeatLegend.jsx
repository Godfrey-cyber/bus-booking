const ITEMS = [
  { label: 'Available', className: 'border-fleet-black/15 bg-fleet-white' },
  { label: 'Selected', className: 'border-fleet-yellow-dark bg-fleet-yellow' },
  { label: 'Booked', className: 'border-fleet-black/5 bg-fleet-black/10' },
]

export default function SeatLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {ITEMS.map((item) => (
        <div key={item.label} className="flex items-center gap-2 text-xs text-fleet-charcoal">
          <span className={`h-4 w-4 rounded border ${item.className}`} />
          {item.label}
        </div>
      ))}
    </div>
  )
}
