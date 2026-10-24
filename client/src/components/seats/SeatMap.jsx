import { cn } from '../../utils/cn'
import { HiOutlineUserAdd } from 'react-icons/hi'

const STATUS_STYLES = {
  available: 'border-fleet-black/15 bg-fleet-white text-fleet-charcoal hover:border-fleet-yellow-dark',
  booked: 'border-fleet-black/5 bg-fleet-black/10 text-fleet-gray/50 cursor-not-allowed',
  selected: 'border-fleet-yellow-dark bg-fleet-yellow text-fleet-black',
}

// Renders seats in a 2 + aisle + 2 layout, four rows worth of visual rhythm at a time,
// with the last row spanning the back bench — the standard intercity coach layout.
export default function SeatMap({ seatMap, selectedSeatNumbers, onToggle }) {
  const rows = []
  const perRow = 4
  const lastRowSize = seatMap?.length % perRow === 0 ? perRow + 1 : seatMap?.length % perRow
  const bodySeats = seatMap?.slice(0, seatMap?.length - lastRowSize)
  const backRow = seatMap?.slice(seatMap?.length - lastRowSize)

  for (let i = 0; i < bodySeats?.length; i += perRow) {
    rows.push(bodySeats?.slice(i, i + perRow))
  }

  const renderSeat = (seat) => {
    const isSelected = selectedSeatNumbers.includes(seat.seat_number)
    const status = seat?.status === 'booked' ? 'booked' : isSelected ? 'selected' : 'available'
    return (
      <button
        key={seat?.seat_number}
        type="button"
        disabled={seat?.status === 'booked'}
        onClick={() => onToggle(seat)}
        aria-pressed={isSelected}
        aria-label={`Seat ${seat?.seat_number}, ${status}`}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg border text-xs font-semibold font-mono transition-colors',
          STATUS_STYLES[status]
        )}
      >
        {seat?.seat_number}
      </button>
    )
  }

  return (
    <div className="rounded-2xl border border-fleet-black/[0.06] bg-fleet-light/50 p-5">
      <div className="mb-5 flex items-center justify-between text-xs text-fleet-gray">
        <span className="rounded-md bg-fleet-black/5 px-2.5 py-1 font-mono">Driver</span>
        <span className="rounded-md bg-fleet-black/5 px-2.5 py-1 font-mono">Door</span>
      </div>

      <div className="flex flex-col gap-3">
        {rows?.map((row, i) => (
          <div key={i} className="flex items-center justify-center gap-6">
            <div className="flex gap-2">{row?.slice(0, 2).map(renderSeat)}</div>
            <div className="flex gap-2">{row?.slice(2, 4).map(renderSeat)}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-wide text-fleet-gray">
        <HiOutlineUserAdd className="h-3.5 w-3.5" /> Emergency exit — back row
      </div>
      <div className="mt-3 flex justify-center gap-2">{backRow?.map(renderSeat)}</div>
    </div>
  )
}
