import { useState } from 'react'
import { HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineUsers, HiOutlinePencil } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import RouteSearchForm from './RouteSearchForm'
import { formatDate } from '../../utils/format'

const SearchSummaryBar = () => {
  const { origin, destination, date, passengers } = useSelector((state) => state.search)
  const [editing, setEditing] = useState(false)

  if (editing) {
    return (
      <div className="mb-6">
        <RouteSearchForm variant="compact" />
        <button onClick={() => setEditing(false)} className="mt-2 text-xs font-medium text-fleet-gray hover:underline">
          Cancel
        </button>
      </div>
    )
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-fleet-black/[0.06] bg-fleet-white px-4 py-3">
      <div className="flex flex-wrap items-center gap-4 text-sm text-fleet-charcoal">
        <span className="flex items-center gap-1.5 font-semibold text-fleet-black">
          <HiOutlineLocationMarker className="h-4 w-4 text-fleet-yellow-dark" />
          {origin} <span className="text-fleet-gray">→</span> {destination}
        </span>
        <span className="flex items-center gap-1.5">
          <HiOutlineCalendar className="h-4 w-4 text-fleet-gray" />
          {date ? formatDate(date) : 'Any date'}
        </span>
        <span className="flex items-center gap-1.5">
          <HiOutlineUsers className="h-4 w-4 text-fleet-gray" />
          {passengers} {passengers === 1 ? 'passenger' : 'passengers'}
        </span>
      </div>
      <button
        onClick={() => setEditing(true)}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-fleet-black hover:bg-fleet-black/5"
      >
        <HiOutlinePencil className="h-3.5 w-3.5" /> Edit search
      </button>
    </div>
  )
}
export default SearchSummaryBar 