import { useDispatch, useSelector } from 'react-redux'
import { setFilters, resetFilters } from '../../redux/features/search/searchSlice'
import Checkbox from '../forms/Checkbox'
import Button from '../common/Button'
import { AMENITIES, AMENITY_LABELS } from '../../mock/buses'

const DEPARTURE_WINDOWS = [
  { id: 'morning', label: 'Morning (5am–12pm)' },
  { id: 'afternoon', label: 'Afternoon (12pm–5pm)' },
  { id: 'evening', label: 'Evening (5pm–9pm)' },
  { id: 'night', label: 'Night (9pm–5am)' },
]

const FilterSidebar = () => {
  const dispatch = useDispatch()
  const filters = useSelector((state) => state.search.filters)

  const toggleAmenity = (amenity) => {
    const next = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity]
    dispatch(setFilters({ amenities: next }))
  }

  const setDepartureWindow = (windowId) => {
    dispatch(setFilters({ departureWindow: filters.departureWindow === windowId ? null : windowId }))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold text-fleet-black">Filters</h2>
        <button onClick={() => dispatch(resetFilters())} className="text-xs font-medium text-fleet-yellow-dark hover:underline">
          Clear all
        </button>
      </div>

      <fieldset>
        <legend className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-fleet-gray">Amenities</legend>
        <div className="flex flex-col gap-2">
          {AMENITIES.map((amenity) => (
            <Checkbox
              key={amenity}
              id={`amenity-${amenity}`}
              label={AMENITY_LABELS[amenity]}
              checked={filters.amenities.includes(amenity)}
              onChange={() => toggleAmenity(amenity)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-fleet-gray">Departure time</legend>
        <div className="flex flex-col gap-2">
          {DEPARTURE_WINDOWS.map((w) => (
            <Checkbox
              key={w.id}
              id={`window-${w.id}`}
              label={w.label}
              checked={filters.departureWindow === w.id}
              onChange={() => setDepartureWindow(w.id)}
            />
          ))}
        </div>
      </fieldset>
    </div>
  )
}
export default FilterSidebar
