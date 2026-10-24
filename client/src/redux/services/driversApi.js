import { apiSlice } from './apiSlice'
import { buildQueryString } from '../../utils/queryString'

// Normalizes whatever envelope the backend wraps the list in (`{ data: [...] }`,
// `{ drivers: [...] }`, or a bare array) into a plain array the UI can rely on.
function unwrapList(response) {
    if (Array.isArray(response)) return response
    return response?.data ?? response?.drivers ?? []
}

function unwrapItem(response) {
    return response?.data ?? response?.driver ?? response
}

// Client-side filter/sort kept as a safety net — harmless if the backend already
// filtered (re-filtering matching rows is a no-op), and correct if it hasn't yet.
function applyFiltersAndSort(drivers, { filters, sortBy } = {}) {
  let results = drivers

  if (filters?.amenities?.length) {
    results = results.filter((driver) => filters.amenities.every((a) => driver.amenities?.includes(a)))
  }
  if (filters?.operators?.length) {
    results = results.filter((driver) => filters.operators.includes(driver.operator?.name))
  }
  if (filters?.priceRange) {
    const [min, max] = filters.priceRange
    results = results.filter((driver) => driver.price >= min && driver.price <= max)
  }

  return [...results].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price
    if (sortBy === 'duration') return a.durationMinutes - b.durationMinutes
    if (sortBy === 'rating') return (b.operator?.rating ?? 0) - (a.operator?.rating ?? 0)
    return new Date(a.departureTime) - new Date(b.departureTime)
  })
}

export const driversApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        
        searchDrivers: builder.query({
            query: ({ } = {}) => ({
                url: `/drivers/all-drivers/`,
            }),
            transformResponse: (response, _meta, arg) => applyFiltersAndSort(unwrapList(response), arg),
        
            providesTags: (result) =>
            result
                ? [...result.map((driver) => ({ type: 'Drivers', id: driver.id })), { type: 'Drivers', id: 'LIST' }]
                : [{ type: 'Drivers', id: 'LIST' }],
        }),

        getOperatorDrivers: builder.query({
            query: () => '/drivers/operator-drivers',
            transformResponse: (response) => unwrapItem(response),
            providesTags: (result) =>
                Array.isArray(result)
                ? [
                    ...result.map(({ id }) => ({ type: 'Drivers', id })),
                      { type: 'Drivers', id: 'MY_DRIVERS' },
                    ]
                : [{ type: 'Drivers', id: 'MY_BUSES' }],
        }),
        
        getDriverById: builder.query({
            query: (driver_id) => `/drivers/driver/${driver_id}`,
            transformResponse: (response) => unwrapItem(response),
            providesTags: (result, error, driver_id) => [{ type: 'Drivers', id: driver_id }],
        }),

        // POST /driver — creates a new driver and invalidates list cache
        createDriver: builder.mutation({
            query: (newBusData) => ({
                url: '/drivers',
                method: 'POST',
                body: newBusData,
            }),
            transformResponse: (response) => unwrapItem(response),
            invalidatesTags: [
                { type: 'Drivers', id: 'MY_DRIVERS' },
                { type: 'Drivers', id: 'LIST' },
            ],
        }),
    }),
})

export const { useSearchDriversQuery, useGetDriverByIdQuery, useGetOperatorDriversQuery, useCreateDriverMutation } = driversApi