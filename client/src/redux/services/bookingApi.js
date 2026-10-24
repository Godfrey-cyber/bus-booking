import { apiSlice } from './apiSlice'
import { buildQueryString } from '../../utils/queryString'

function unwrapList(response) {
  if (Array.isArray(response)) return response
  return response?.data ?? respsonse?.bookings ?? []
}

function unwrapItem(response) {
  return response?.data ?? response?.booking ?? response
}

export const bookingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /bookings/all-booking?status=upcoming&page=1&limit=20
    // The backend scopes this to the authenticated user via the Authorization
    // header (see apiSlice's prepareHeaders) — no userId needs to travel in the URL.
    // `status`/`page`/`limit` are optional so MyBookings can request one tab's
    // worth of rows instead of the whole history every time. status, page = 1, limit = 20
    getMyBookings: builder.query({
      query: ({ bookingID, status, page, limit } = {}) =>
        `/bookings/my-bookings/${bookingID}${buildQueryString({status, page, limit})}`,
      transformResponse: (response) => unwrapList(response),
      providesTags: (result) =>
        result
          ? [...result.map((b) => ({ type: 'Booking', id: b.id })), { type: 'Booking', id: 'LIST' }]
          : [{ type: 'Booking', id: 'LIST' }],
    }),

    getAllBookings: builder.query({
      query: ({ status, page, limit } = {}) => `/bookings/all-bookings${buildQueryString({status, page, limit})}`,
      transformResponse: (response) => unwrapList(response),
      providesTags: (result) =>
        result
          ? [...result.map((b) => ({ type: 'Booking', id: b.id })), { type: 'Booking', id: 'LIST' }]
          : [{ type: 'Booking', id: 'LIST' }],
    }),

    // GET /bookings/booking/:bookingId — used by the Ticket page and by any
    // detail view that only has an id (e.g. deep link from a notification).
    getBookingById: builder.query({
      query: (bookingID) => `/bookings/booking/${bookingID}`,
      transformResponse: (response) => unwrapItem(response),
      providesTags: (result, error, bookingID) => [{ type: 'Booking', id: bookingId }],
    }),

    // PATCH /bookings/booking/:bookingId/cancel — confirm this path with the
    // backend team; adjust to whatever cancellation route actually exists.
    cancelBooking: builder.mutation({
      query: ({ bookingId, reason }) => ({
        url: `/bookings/booking/${bookingId}/cancel`,
        method: 'PATCH',
        body: { reason },
      }),
      // Optimistic update: flip the row to 'cancelled' in every cache that holds
      // it (the list AND the single-booking cache) before the response lands,
      // so the UI feels instant. Rolled back automatically if the request fails.
      async onQueryStarted({ bookingId }, { dispatch, queryFulfilled }) {
        const patches = [
          dispatch(
            bookingApi.util.updateQueryData('getMyBookings', {}, (draft) => {
              const booking = draft.find((b) => b.id === bookingId)
              if (booking) booking.status = 'cancelled'
            })
          ),
          dispatch(
            bookingApi.util.updateQueryData('getBookingById', bookingId, (draft) => {
              if (draft) draft.status = 'cancelled'
            })
          ),
        ]
        try {
          await queryFulfilled
        } catch {
          patches.forEach((patch) => patch.undo())
        }
      },
      // Still invalidate — covers other cached `getMyBookings` variants (e.g. a
      // different status filter) that the optimistic patch above didn't touch.
      invalidatesTags: (result, error, { bookingId }) => [
        { type: 'Booking', id: bookingId },
        { type: 'Booking', id: 'LIST' },
      ],
    }),

    // POST /bookings/booking/:bookingId/refund — confirm this path too.
    requestRefund: builder.mutation({
      query: ({ bookingId, reason }) => ({
        url: `/bookings/booking/${bookingId}/refund`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: (result, error, { bookingId }) => [
        { type: 'Booking', id: bookingId },
        { type: 'Booking', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetMyBookingsQuery,
  useGetAllBookingsQuery,
  useGetBookingByIdQuery,
  useCancelBookingMutation,
  useRequestRefundMutation,
} = bookingApi