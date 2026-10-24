// Mock inventory for the operator dashboard (Coast Riders / Savannah Express demo account).
export const OPERATOR_STATS = {
  todayTrips: 6,
  todayRevenue: 84500,
  todayPassengers: 212,
  busUtilization: 0.78,
}

export const REVENUE_TREND = [
  { day: 'Mon', revenue: 62000, bookings: 48 },
  { day: 'Tue', revenue: 71500, bookings: 55 },
  { day: 'Wed', revenue: 58000, bookings: 41 },
  { day: 'Thu', revenue: 89000, bookings: 63 },
  { day: 'Fri', revenue: 112000, bookings: 78 },
  { day: 'Sat', revenue: 134000, bookings: 91 },
  { day: 'Sun', revenue: 97500, bookings: 66 },
]

export const OCCUPANCY_BY_ROUTE = [
  { route: 'NBO–MSA', occupancy: 88 },
  { route: 'NBO–KSM', occupancy: 64 },
  { route: 'NBO–NKR', occupancy: 72 },
  { route: 'NBO–ELD', occupancy: 55 },
]

export const OPERATOR_BUSES = [
  { id: 'ob1', plate: 'KDA 221B', model: 'Scania Marcopolo', capacity: 44, status: 'active', amenities: ['ac', 'wifi'] },
  { id: 'ob2', plate: 'KDB 774T', model: 'Isuzu NQR Coach', capacity: 36, status: 'active', amenities: ['ac'] },
  { id: 'ob3', plate: 'KDC 019M', model: 'Mercedes Travego', capacity: 32, status: 'maintenance', amenities: ['ac', 'wifi', 'luxury'] },
]

export const OPERATOR_DESTINATIONS = [
  { id: 'ob1', city: 'Nairobi', country: 'Kenya', latitude: -21.34545, longitude: 346.34545, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZ2v1sdDdWK_wwN39tr1rSYH4domTiqGYh9i6oXFx-3g&s=10' },
  { id: 'ob2', city: 'Mombasa', country: 'Kenya', latitude: -23.634, longitude: 567.34545, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZ2v1sdDdWK_wwN39tr1rSYH4domTiqGYh9i6oXFx-3g&s=10' },
  { id: 'ob3', city: 'Arusha', country: 'Tanzania', latitude: -42.343, longitude: 347.34545, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZ2v1sdDdWK_wwN39tr1rSYH4domTiqGYh9i6oXFx-3g&s=10' },
]

export const OPERATOR_ROUTES = [
  { id: 'or1', origin: 'Nairobi', destination: 'Mombasa', distanceKm: 485, durationMin: 510, basePrice: 1500 },
  { id: 'or2', origin: 'Nairobi', destination: 'Kisumu', distanceKm: 340, durationMin: 465, basePrice: 1350 },
  { id: 'or3', origin: 'Nairobi', destination: 'Eldoret', distanceKm: 312, durationMin: 300, basePrice: 1100 },
]

export const OPERATOR_SCHEDULES = [
  { id: 'os1', routeId: 'or1', busId: 'ob1', departureTime: '2026-08-02T07:00:00', status: 'scheduled' },
  { id: 'os2', routeId: 'or1', busId: 'ob2', departureTime: '2026-08-02T21:00:00', status: 'scheduled' },
  { id: 'os3', routeId: 'or2', busId: 'ob3', departureTime: '2026-08-03T09:30:00', status: 'cancelled' },
]

export const OPERATOR_DRIVERS = [
  { id: 'od1', name: 'Peter Kamau', license: 'DL-2291087', phone: '+254 712 334 556', assignedBusId: 'ob1' },
  { id: 'od2', name: 'James Otieno', license: 'DL-3382019', phone: '+254 733 118 220', assignedBusId: 'ob2' },
  { id: 'od3', name: 'Musa Ali', license: 'DL-1120983', phone: '+254 701 552 984', assignedBusId: 'ob3' },
]

export const OPERATOR_BOOKINGS = [
  { id: 'obk1', passenger: 'Faith Njeri', reference: 'FG-8X29QK', route: 'Nairobi → Mombasa', seats: [12, 13], status: 'upcoming', amount: 3000 },
  { id: 'obk2', passenger: 'Kevin Mutua', reference: 'FG-4L10RS', route: 'Nairobi → Kisumu', seats: [4], status: 'checked_in', amount: 1350 },
  { id: 'obk3', passenger: 'Grace Achieng', reference: 'FG-9P73WD', route: 'Nairobi → Eldoret', seats: [8, 9], status: 'completed', amount: 2200 },
  { id: 'obk4', passenger: 'Samuel Kiptoo', reference: 'FG-2Z55HN', route: 'Nairobi → Mombasa', seats: [3], status: 'cancelled', amount: 1500 },
]