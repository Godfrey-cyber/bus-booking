import { apiSlice } from './apiSlice'
import { buildQueryString } from '../../utils/queryString'

// Normalizes whatever envelope the backend wraps the list in (`{ data: [...] }`,
// `{ buses: [...] }`, or a bare array) into a plain array the UI can rely on.
function unwrapList(response) {
  if (Array.isArray(response)) return response
  return response?.data ?? response?.trips ?? []
}

function unwrapItem(response) {
  return response?.data ?? response?.trip ?? response
}

// Client-side filter/sort kept as a safety net — harmless if the backend already
// filtered (re-filtering matching rows is a no-op), and correct if it hasn't yet.
function applyFiltersAndSort(trip, { filters, sortBy } = {}) {
  let results = trip

  if (filters?.amenities?.length) {
    results = results.filter((trip) => filters.amenities.every((a) => trip.amenities?.includes(a)))
  }
  if (filters?.operators?.length) {
    results = results.filter((trip) => filters.operators.includes(trip.operator_name))
  }
  if (filters?.priceRange) {
    const [min, max] = filters.priceRange
    results = results.filter((trip) => trip.price >= min && trip.price <= max)
  }

  return [...results].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price
    if (sortBy === 'duration') return a.duration_minutes - b.duration_minutes
    if (sortBy === 'rating') return (b.rating_avg ?? 0) - (a.rating_avg ?? 0)
    return new Date(a.departure_time) - new Date(b.departure_time)
  })
}

export const tripsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /trips/all-trips/?origin=...&destination=...&amenities=ac,wifi&sortBy=price
    // Filters are sent as query params so the backend can do the heavy lifting once
    // it supports it; applyFiltersAndSort re-applies them client-side as a fallback.
    searchTrips: builder.query({
      query: ({ origin, destination, filters, sortBy } = {}) => ({
        url: `/trips/all-trips${buildQueryString({ origin, destination, filters, sortBy })}`,
      }),
      transformResponse: (response, _meta, arg) => applyFiltersAndSort(unwrapList(response), arg),
      // Per-item tags (not just a blanket 'Trips' tag) so a mutation on one trip can
      // invalidate just that row's cache entry instead of every search variant.
      providesTags: (result) =>
        result
          ? [...result.map((trip) => ({ type: 'Trips', id: trip.trip_id })), { type: 'Trips', id: 'LIST' }]
          : [{ type: 'Trips', id: 'LIST' }],
    }),

    // GET /trips/trip/:tripId — mirrors the /bookings/booking/:id convention your
    // backend already uses. Add this route on the API if it isn't there yet;
    // fetching the full list to find one trip doesn't scale past a handful of trips.
    getTripById: builder.query({
        query: (trip_id) => `/trips/trip/${trip_id}`,
        transformResponse: (response) => unwrapItem(response),
        providesTags: (result, error, trip_id) => [{ type: 'Trips', id: trip_id }],
    }),
  }),
})

export const { useSearchTripsQuery, useGetTripByIdQuery } = tripsApi



// CREATE TABLE bookings (
//   id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
//   booking_reference char(10) NOT NULL,
//   user_id bigint(20) NOT NULL,
//   schedule_id bigint(20) unsigned NOT NULL,
//   status enum('pending','confirmed','cancelled','completed','refunded') NOT NULL DEFAULT 'pending',
//   passenger_count tinyint(3) unsigned NOT NULL,
//   subtotal decimal(10,2) NOT NULL,
//   discount_amount decimal(10,2) NOT NULL DEFAULT 0.00,
//   tax_amount decimal(10,2) NOT NULL DEFAULT 0.00,
//   total_amount decimal(10,2) NOT NULL,
//   promo_code_id bigint(20) unsigned DEFAULT NULL,
//   emergency_contact_name varchar(120) DEFAULT NULL,
//   emergency_contact_phone varchar(30) DEFAULT NULL,
//   cancellation_fee decimal(10,2) DEFAULT NULL,
//   created_at datetime NOT NULL DEFAULT current_timestamp(),
//   updated_at datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
//   deleted_at datetime DEFAULT NULL,
//   PRIMARY KEY (id),
//   UNIQUE KEY booking_reference (booking_reference),
//   KEY fk_bookings_schedule (schedule_id),
//   KEY fk_bookings_promo (promo_code_id),
//   KEY idx_bookings_user_status (user_id,status),
//   CONSTRAINT fk_bookings_promo FOREIGN KEY (promo_code_id) REFERENCES promo_codes (id) ON DELETE SET NULL,
//   CONSTRAINT fk_bookings_schedule FOREIGN KEY (schedule_id) REFERENCES schedules (id),
//   CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users (id)
// )