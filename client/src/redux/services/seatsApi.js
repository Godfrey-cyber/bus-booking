import { apiSlice } from './apiSlice'
import { buildQueryString } from '../../utils/queryString'

// Normalizes whatever envelope the backend wraps the list in (`{ data: [...] }`,
// `{ buses: [...] }`, or a bare array) into a plain array the UI can rely on.
// function unwrapList(response) {
//   if (Array.isArray(response)) return response
//   return response?.data ?? response?.seats ?? []
// }

// function unwrapItem(response) {
//   return response?.data ?? response?.seat ?? response
// }

// Client-side filter/sort kept as a safety net — harmless if the backend already
// filtered (re-filtering matching rows is a no-op), and correct if it hasn't yet.

function unwrapList(response) {
    if (!response) return [];

    // 1. If backend returned raw mysql2 response [rows, fields]
    if (Array.isArray(response) && Array.isArray(response[0])) {
        return response[0];
    }

    // 2. Standard plain array
    if (Array.isArray(response)) {
        return response;
    }

    // 3. Object envelopes ({ data: [...] }, { seats: [...] }, { result: [...] })
    const list = response?.data ?? response?.seats ?? response?.result ?? [];
      
    // Handle case where envelope property itself is a mysql2 nested array
    if (Array.isArray(list) && Array.isArray(list[0])) {
        return list[0];
    }

    return Array.isArray(list) ? list : [];
}

export const seatsApi = apiSlice.injectEndpoints({

    endpoints: (builder) => ({

        searchSeats: builder.query({
            query: ({ trip_id, bus_id }) => ({
                url: `/trip-seats/${trip_id}/seats/${bus_id}`,
            }),
            transformResponse: (response) => unwrapList(response),
            // Per-item tags (not just a blanket 'Buses' tag) so a mutation on one payment can
            // invalidate just that row's cache entry instead of every search variant.
            providesTags: (result) =>
                Array.isArray(result) && result.length > 0
              ? [
                  ...result.map((seat) => ({
                    type: 'Seats',
                    id: seat.bus_seat_id || seat.id || seat.seat_id,
                  })),
                  { type: 'Seats', id: 'LIST' },
                ]
            : [{ type: 'Seats', id: 'LIST' }],
        })
    }),
})

export const { useSearchSeatsQuery } = seatsApi
