import { HiOutlineWifi, HiOutlineLightningBolt, HiOutlineSparkles, HiOutlineFastForward } from 'react-icons/hi'
import { MdAcUnit } from 'react-icons/md'

export const AMENITY_META = {
  ac: { label: 'AC', icon: MdAcUnit },
  wifi: { label: 'WiFi', icon: HiOutlineWifi },
  charging: { label: 'Charging', icon: HiOutlineLightningBolt },
  luxury: { label: 'Luxury', icon: HiOutlineSparkles },
  express: { label: 'Express', icon: HiOutlineFastForward },
}

export const DEPARTURE_WINDOWS = [
  { id: 'morning', label: 'Morning', range: '5am–12pm' },
  { id: 'afternoon', label: 'Afternoon', range: '12pm–5pm' },
  { id: 'evening', label: 'Evening', range: '5pm–9pm' },
  { id: 'night', label: 'Night', range: '9pm–5am' },
]
