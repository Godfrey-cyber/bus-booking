// Mock schedule/inventory data — one entry per departure. Filtered client-side by
// the mock busesApi to emulate what a real search endpoint would return.
const AMENITIES = ['ac', 'wifi', 'charging', 'luxury', 'express']

function seatMapFor(totalSeats, bookedSeats) {
  return Array.from({ length: totalSeats }, (_, i) => {
    const seatNumber = i + 1
    return {
      seatNumber,
      status: bookedSeats.includes(seatNumber) ? 'booked' : 'available',
    }
  })
}

export const MOCK_BUSES = [
  {
    id: 'bus-101',
    operator: { id: 'op1', name: 'Coast Riders', rating: 4.7 },
    route: { origin: 'Nairobi', destination: 'Mombasa' },
    departureTime: '2026-08-02T07:00:00',
    arrivalTime: '2026-08-02T15:30:00',
    durationMinutes: 510,
    price: 1500,
    amenities: ['ac', 'wifi', 'charging'],
    totalSeats: 44,
    seatMap: seatMapFor(44, [3, 4, 12, 20, 21, 33]),
    boardingPoint: 'Nairobi CBD — Accra Road',
    arrivalPoint: 'Mombasa — Kobil Bus Station',
  },
  {
    id: 'bus-102',
    operator: { id: 'op2', name: 'Savannah Express', rating: 4.5 },
    route: { origin: 'Nairobi', destination: 'Mombasa' },
    departureTime: '2026-08-02T09:30:00',
    arrivalTime: '2026-08-02T17:15:00',
    durationMinutes: 465,
    price: 1350,
    amenities: ['ac', 'express'],
    totalSeats: 36,
    seatMap: seatMapFor(36, [1, 2, 5, 15, 16, 17, 28]),
    boardingPoint: 'Nairobi — River Road Terminus',
    arrivalPoint: 'Mombasa — Buxton Terminus',
  },
  {
    id: 'bus-103',
    operator: { id: 'op3', name: 'Rift Valley Shuttle', rating: 4.6 },
    route: { origin: 'Nairobi', destination: 'Mombasa' },
    departureTime: '2026-08-02T21:00:00',
    arrivalTime: '2026-08-03T05:00:00',
    durationMinutes: 480,
    price: 1800,
    amenities: ['ac', 'wifi', 'charging', 'luxury'],
    totalSeats: 32,
    seatMap: seatMapFor(32, [6, 7, 8, 9, 22]),
    boardingPoint: 'Nairobi CBD — Mombasa Raha Stage',
    arrivalPoint: 'Mombasa — Mwembe Tayari',
  },
  {
    id: 'bus-104',
    operator: { id: 'op4', name: 'Northline Coaches', rating: 4.3 },
    route: { origin: 'Nairobi', destination: 'Mombasa' },
    departureTime: '2026-08-02T13:00:00',
    arrivalTime: '2026-08-02T21:45:00',
    durationMinutes: 525,
    price: 1150,
    amenities: [],
    totalSeats: 44,
    seatMap: seatMapFor(44, [10, 11, 19, 30, 31, 32, 40]),
    boardingPoint: 'Nairobi — Machakos Country Bus',
    arrivalPoint: 'Mombasa — Kobil Bus Station',
  },
]

export function findBusById(busId) {
  return MOCK_BUSES.find((b) => b.id === busId) ?? null
}

export const AMENITY_LABELS = {
  ac: 'AC',
  wifi: 'WiFi',
  charging: 'Charging ports',
  luxury: 'Luxury',
  express: 'Express',
}

export { AMENITIES }
