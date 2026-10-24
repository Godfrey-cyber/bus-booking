import { apiSlice } from './apiSlice'
import { buildQueryString } from '../../utils/queryString'

// Normalizes whatever envelope the backend wraps the list in (`{ data: [...] }`,
// `{ buses: [...] }`, or a bare array) into a plain array the UI can rely on.
function unwrapList(response) {
    if (Array.isArray(response)) return response
    return response?.data ?? response?.buses ?? []
}

function unwrapItem(response) {
    return response?.data ?? response?.bus ?? response
}

// Client-side filter/sort kept as a safety net — harmless if the backend already
// filtered (re-filtering matching rows is a no-op), and correct if it hasn't yet.
function applyFiltersAndSort(buses, { filters, sortBy } = {}) {
  let results = buses

  if (filters?.amenities?.length) {
    results = results.filter((bus) => filters.amenities.every((a) => bus.amenities?.includes(a)))
  }
  if (filters?.operators?.length) {
    results = results.filter((bus) => filters.operators.includes(bus.operator?.name))
  }
  if (filters?.priceRange) {
    const [min, max] = filters.priceRange
    results = results.filter((bus) => bus.price >= min && bus.price <= max)
  }

  return [...results].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price
    if (sortBy === 'duration') return a.durationMinutes - b.durationMinutes
    if (sortBy === 'rating') return (b.operator?.rating ?? 0) - (a.operator?.rating ?? 0)
    return new Date(a.departureTime) - new Date(b.departureTime)
  })
}

export const busesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // GET /buses/all-buses/?origin=...&destination=...&amenities=ac,wifi&sortBy=price
        // Filters are sent as query params so the backend can do the heavy lifting once
        // it supports it; applyFiltersAndSort re-applies them client-side as a fallback.
        searchBuses: builder.query({
            query: ({ origin, destination, filters, sortBy } = {}) => ({
                url: `/buses/all-buses/`,
            }),
            transformResponse: (response, _meta, arg) => applyFiltersAndSort(unwrapList(response), arg),
            // Per-item tags (not just a blanket 'Buses' tag) so a mutation on one bus can
            // invalidate just that row's cache entry instead of every search variant.
            providesTags: (result) =>
            result
                ? [...result.map((bus) => ({ type: 'Buses', id: bus.id })), { type: 'Buses', id: 'LIST' }]
                : [{ type: 'Buses', id: 'LIST' }],
        }),

        getOperatorBuses: builder.query({
            query: ({ userId }) => ({ 
                url: '/buses/operator-buses', 
                method: 'GET',
                params: { userId },
            }),
            transformResponse: (response) => unwrapItem(response),
            providesTags: (result, error, userId) => [{ type: 'Buses', id: userId }],
        }),
        // GET /buses/bus/:busId — mirrors the /bookings/booking/:id convention your
        // backend already uses. Add this route on the API if it isn't there yet;
        // fetching the full list to find one bus doesn't scale past a handful of buses.
        getBusById: builder.query({
            query: (bus_id) => `/buses/bus/${bus_id}`,
            transformResponse: (response) => unwrapItem(response),
            providesTags: (result, error, bus_id) => [{ type: 'Buses', id: bus_id }],
        }),

        // POST /buses — creates a new bus and invalidates list cache
        createBus: builder.mutation({
            query: (newBusData) => ({
                url: '/buses/new-bus',
                method: 'POST',
                body: newBusData,
            }),
            transformResponse: (response) => unwrapItem(response),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Buses', id: 'MY_BUSES' },
                { type: 'Buses', id: 'LIST' },
            ],
        }),
    }),
})

export const { useSearchBusesQuery, useGetBusByIdQuery, useGetOperatorBusesQuery, useCreateBusMutation } = busesApi