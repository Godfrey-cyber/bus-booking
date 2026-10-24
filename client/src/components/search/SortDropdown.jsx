import { useDispatch, useSelector } from 'react-redux'
import { setSortBy } from '../../redux/features/search/searchSlice'

const OPTIONS = [
  { value: 'departure', label: 'Departure time' },
  { value: 'price', label: 'Price: low to high' },
  { value: 'duration', label: 'Duration' },
  { value: 'rating', label: 'Rating' },
]

const SeatSelectionPage = () => {

  const sortBy = useSelector((state) => state.search.sortBy)
  const dispatch = useDispatch()

  return (
    <label className="flex items-center gap-2 text-sm text-fleet-charcoal">
      <span className="hidden sm:inline">Sort by</span>
      <select
        value={sortBy}
        onChange={(e) => dispatch(setSortBy(e.target.value))}
        className="rounded-lg border border-fleet-black/10 bg-fleet-white px-2.5 py-1.5 text-sm font-medium focus:border-fleet-yellow-dark focus:outline-none"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
export default SeatSelectionPage