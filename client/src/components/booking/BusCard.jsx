import { useNavigate } from "react-router-dom"
import { HiStar, HiOutlineClock, HiOutlineLocationMarker } from 'react-icons/hi'
import { GiPathDistance } from "react-icons/gi";
import Card from '../common/Card'
import Badge from '../common/Badge'
import Button from '../common/Button'
import { formatCurrency, formatTime, formatDuration } from '../../utils/format'
import { AMENITY_LABELS } from '../../mock/buses'

const BusCard = ({ bus }) => {
  const navigate = useNavigate()
  // const availableSeats = bus.seatMap.filter((s) => s.status === 'available').length
  const availableSeats = 12
  console.log(availableSeats)

  return (
    <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-center justify-between gap-2 sm:justify-start sm:gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-fleet-yellow/15 font-display text-sm font-bold text-fleet-yellow-dark">
              {bus?.name.charAt(0)}
            </div>
            <div>
              <p className="font-display text-sm font-semibold text-fleet-black">{bus?.name}</p>
              <p className="flex items-center gap-1 text-xs text-fleet-gray">
                <HiStar className="h-3.5 w-3.5 text-fleet-yellow-dark" /> {bus?.rating}
              </p>
            </div>
          </div>
          <Badge tone={availableSeats > 10 ? 'success' : availableSeats > 0 ? 'warning' : 'error'}>
            {availableSeats > 0 ? `${availableSeats} seats left` : 'Sold out'}
          </Badge>
        </div>

        <div className="flex items-center gap-4 sm:gap-8">
          <div>
            <p className="font-display text-lg font-bold text-fleet-black">{formatTime(bus?.departure_time)}</p>
            <p className="text-xs text-fleet-gray">{bus?.route.origin}</p>
          </div>
          <div className="flex flex-1 flex-col items-center text-fleet-gray">
            <span className="flex items-center gap-1 text-xs">
              <HiOutlineClock className="h-3.5 w-3.5" /> {formatDuration(bus?.duration_minutes)}
            </span>
            <div className="mt-1 h-px w-full min-w-[40px] bg-fleet-black/10 sm:min-w-[80px]" />
            <span className="flex items-center gap-1 text-xs">
              <GiPathDistance className="h-3.5 w-3.5" /> {bus?.distance_km}
            </span>
          </div>
          <div>
            <p className="font-display text-lg font-bold text-fleet-black">{formatTime(bus?.arrivalTime)}</p>
            <p className="text-xs text-fleet-gray">{bus?.distance}</p> {/* bus?.route.destination */}
          </div>
        </div>

        {bus.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {bus?.amenities.map((a) => (
              <Badge key={a} tone="neutral">
                {/*{AMENITY_LABELS[a]}*/}
                {a}
              </Badge>
            ))}
          </div>
        )}

        <p className="flex items-center gap-1 text-xs text-fleet-gray">
          <HiOutlineLocationMarker className="h-3.5 w-3.5" /> {bus?.boardingPoint}
        </p>
      </div>

      <div className="flex flex-row items-center justify-between gap-4 border-t border-fleet-black/[0.06] pt-4 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
        <p className="font-display text-xl font-bold text-fleet-black">{formatCurrency(bus?.price)}</p>
        <Button
          disabled={availableSeats === 0}
          onClick={() => navigate(`/buses/${bus?.id}`)}
        >
          View seats
        </Button>
      </div>
    </Card>
  )
}

export default BusCard