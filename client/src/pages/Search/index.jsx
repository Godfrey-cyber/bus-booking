import { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import { HiOutlineAdjustments, HiX, HiOutlineEmojiSad } from 'react-icons/hi'
import { GiPathDistance } from "react-icons/gi";
import Container from '../../components/common/Container'
import RouteSearchForm from '../../components/search/RouteSearchForm'
import FilterSidebar from '../../components/search/FilterSidebar'
import BusCard from '../../components/booking/BusCard'
import BusCardSkeleton from '../../components/booking/BusCardSkeleton'
import EmptyState from '../../components/common/EmptyState'
import Button from '../../components/common/Button'
import { useSearchBusesQuery } from '../../redux/services/busesApi'
import { useSearchTripsQuery, useGetTripByIdQuery } from '../../redux/services/tripsApi'
import { setSortBy } from '../../redux/features/search/searchSlice'

import { HiStar, HiOutlineClock, HiOutlineLocationMarker } from 'react-icons/hi'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import { formatCurrency, formatTime, formatDuration } from '../../utils/format'
import { AMENITY_LABELS } from '../../mock/buses'

const SORT_OPTIONS = [
  { id: 'departure', label: 'Departure time' },
  { id: 'price', label: 'Price (low to high)' },
  { id: 'duration', label: 'Duration' },
  { id: 'rating', label: 'Operator rating' },
]

const SearchPage = () => {
  const dispatch = useDispatch()
  const { origin, destination, filters, sortBy } = useSelector((state) => state.search)

  console.log("origin", origin);
  console.log("destination", destination);
  console.log("filters", filters);
  console.log("sortBy", sortBy);

  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const { data: buses, isLoading, isError } = useSearchBusesQuery({ origin, destination, filters, sortBy })
  const { data: trips, isLoading: isTripLoading, isError: isTripError } = useSearchTripsQuery({ origin, destination, filters, sortBy })
  
  console.log('trips', trips);

  const navigate = useNavigate()
  const availableSeats = 12
  console.log(availableSeats)

  return (
    <Container className="py-6 sm:py-8">
      <RouteSearchForm variant="compact" />
      <div className="mt-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-fleet-black sm:text-2xl">
            {origin} → {destination}
          </h1>
          <p className="text-sm text-fleet-gray">
            {isLoading ? 'Searching trips…' : `${trips?.length ?? 0} trips found`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="hidden text-sm text-fleet-gray sm:inline">
            Sort by
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value))}
            className="rounded-lg border border-fleet-black/10 bg-fleet-white px-3 py-2 text-sm font-medium text-fleet-black focus:border-fleet-yellow-dark focus:outline-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            leftIcon={<HiOutlineAdjustments className="h-4 w-4" />}
            onClick={() => setIsFilterOpen(true)}
          >
            Filters
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <FilterSidebar />
        </aside>

        <div className="flex flex-col gap-4">
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => <BusCardSkeleton key={i} />)}

          {isError && (
            <EmptyState
              icon={<HiOutlineEmojiSad />}
              title="Couldn't load trips"
              description="Something went wrong while fetching results. Please try again."
            />
          )}

          {!isLoading && !isError && trips?.length === 0 && (
            <EmptyState
              icon={<HiOutlineEmojiSad />}
              title="No trips match your search"
              description="Try a different date, route, or loosen your filters."
            />
          )}
        {/*</div>*/}
          
        {!isLoading && trips?.map((trip) => (
            // <BusCard key={trip?.trip_id} trip={trip} />
          <Card key={trip?.trip_id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex items-center justify-between gap-2 sm:justify-start sm:gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-fleet-yellow/15 font-display text-sm font-bold text-fleet-yellow-dark">
                    {trip?.operator_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-display text-sm font-semibold text-fleet-black">{trip?.operator_name}</p>
                    <p className="flex items-center gap-1 text-xs text-fleet-gray">
                      <HiStar className="h-3.5 w-3.5 text-fleet-yellow-dark" /> {trip?.rating_avg}
                    </p>
                  </div>
                </div>
                <Badge tone={availableSeats > 10 ? 'success' : availableSeats > 0 ? 'warning' : 'error'}>
                  {availableSeats > 0 ? `${availableSeats} seats left` : 'Sold out'}
                </Badge>
              </div>

              <div className="flex items-center gap-4 sm:gap-8">
                <div>
                  <p className="font-display text-lg font-bold text-fleet-black">{formatTime(trip?.departure_time)}</p>
                    <p className="flex items-center gap-1 text-xs text-fleet-gray">
                        <HiOutlineLocationMarker className="h-3.5 w-3.5" />{trip?.origin} - {trip?.boarding_point}
                        {/*<HiOutlineLocationMarker className="h-3.5 w-3.5" />{trip?.boarding_point}*/}
                    </p>
                </div>
                <div className="flex flex-1 flex-col items-center text-fleet-gray">
                  <span className="flex items-center gap-1 text-xs">
                    <HiOutlineClock className="h-3.5 w-3.5" /> {formatDuration(trip?.duration_minutes)}
                  </span>
                  <div className="mt-1 h-px w-full min-w-[40px] bg-fleet-black/10 sm:min-w-[80px]" />
                  <span className="flex items-center gap-1 text-xs">
                    <GiPathDistance className="h-3.5 w-3.5" /> {trip?.distance} km
                  </span>
                </div>
                <div>
                 <p className="font-display text-lg font-bold text-fleet-black">{formatTime(trip?.arrival_time)}</p>
                 <p className="flex items-center gap-1 text-xs text-fleet-gray">
                        <HiOutlineLocationMarker className="h-3.5 w-3.5" />{trip?.destination} - {trip?.arrival_point}
                        {/*<HiOutlineLocationMarker className="h-3.5 w-3.5" />{trip?.arrival_point}*/}
                    </p>
                </div>
              </div>
              
              {trip?.amenities?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {trip?.amenities?.map((a, idx) => (
                    <Badge key={a} tone="neutral">
                      {a}
                      {/*{AMENITY_LABELS[a]}*/}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-row items-center justify-between gap-4 border-t border-fleet-black/[0.06] pt-4 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
              <p className="font-display text-xl font-bold text-fleet-black">{formatCurrency(trip?.price)}</p>
              <Button
                disabled={availableSeats === 0}
                onClick={() => navigate(`/trips/${trip?.trip_id}`)}
              >
                View seats
              </Button>
            </div>
          </Card>
        ))}

      </div>
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-fleet-black/40 lg:hidden"
              onClick={() => setIsFilterOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 right-0 z-50 w-[85%] max-w-xs overflow-y-auto bg-fleet-white p-5 lg:hidden"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-display text-base font-semibold text-fleet-black">Filters</span>
                <button onClick={() => setIsFilterOpen(false)} aria-label="Close filters">
                  <HiX className="h-5 w-5" />
                </button>
              </div>
              <FilterSidebar />
              <Button className="mt-6 w-full" onClick={() => setIsFilterOpen(false)}>
                Show results
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Container>
  )
}
export default SearchPage