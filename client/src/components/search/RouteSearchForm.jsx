import { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { useDispatch } from 'react-redux'
import { HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineUsers, HiSwitchHorizontal, HiOutlineSearch } from 'react-icons/hi'
import Button from '../common/Button'
import { setSearchParams } from '../../redux/features/search/searchSlice'
import { cn } from '../../utils/cn'

const CITIES = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Kampala', 'Arusha']

const RouteSearchForm = ({ variant = 'hero' }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [origin, setOrigin] = useState('Nairobi')
  const [destination, setDestination] = useState('Mombasa')
  const [date, setDate] = useState('')
  const [passengers, setPassengers] = useState(1)
  const [error, setError] = useState('')

  const swap = () => {
    setOrigin(destination)
    setDestination(origin)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (origin === destination) {
      setError('Origin and destination cannot be the same.')
      return
    }
    setError('')
    dispatch(setSearchParams({ origin, destination, date: date || null, passengers }))
    navigate('/search')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'w-full rounded-2xl bg-fleet-white p-3 shadow-[0_20px_60px_-24px_rgba(11,11,12,0.35)]',
        variant === 'hero' ? 'sm:p-4' : 'border border-fleet-black/[0.06] p-4'
      )}
    >
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-[1fr_auto_1fr_1fr_1fr_auto]">
        <Field icon={<HiOutlineLocationMarker className="h-4.5 w-4.5" />} label="From">
          <select value={origin} onChange={(e) => setOrigin(e.target.value)} className="select-reset" aria-label="Origin city">
            <option value="">Select Origin</option>
            {CITIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>

        <button
          type="button"
          onClick={swap}
          aria-label="Swap origin and destination"
          className="hidden self-center rounded-full border border-fleet-black/10 p-2 text-fleet-gray hover:bg-fleet-black/5 sm:flex"
        >
          <HiSwitchHorizontal className="h-4 w-4" />
        </button>

        <Field icon={<HiOutlineLocationMarker className="h-4.5 w-4.5" />} label="To">
          <select value={destination} onChange={(e) => setDestination(e.target.value)} className="select-reset" aria-label="Destination city">
            <option value="">Select Destination</option>
            {CITIES.map((c) => (
                <option key={c}>{c}</option>
            ))}
          </select>
        </Field>

        <Field icon={<HiOutlineCalendar className="h-4.5 w-4.5" />} label="Date">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="select-reset"
            aria-label="Travel date"
          />
        </Field>

        <Field icon={<HiOutlineUsers className="h-4.5 w-4.5" />} label="Passengers">
          <select
            value={passengers}
            onChange={(e) => setPassengers(Number(e.target.value))}
            className="select-reset"
            aria-label="Number of passengers"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'passenger' : 'passengers'}
              </option>
            ))}
          </select>
        </Field>

        <Button type="submit" size="lg" className="w-full sm:w-auto" rightIcon={<HiOutlineSearch className="h-4.5 w-4.5" />}>
          Search
        </Button>
      </div>
      {error && <p className="mt-2 px-1 text-sm text-state-error">{error}</p>}
    </form>
  )
}

export default RouteSearchForm

function Field({ icon, label, children }) {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-fleet-black/[0.06] bg-fleet-light/60 px-3 py-2.5">
      <span className="text-fleet-yellow-dark">{icon}</span>
      <span className="flex flex-col">
        <span className="text-[11px] font-medium uppercase tracking-wide text-fleet-gray">{label}</span>
        {children}
      </span>
    </label>
  )
}

