import { apiSlice } from './apiSlice'
import { buildQueryString } from '../../utils/queryString'

// Normalizes whatever envelope the backend wraps the list in (`{ data: [...] }`,
// `{ payments: [...] }`, or a bare array) into a plain array the UI can rely on.
function unwrapList(response) {
    if (Array.isArray(response)) return response
    return response?.data ?? response?.payments ?? []
}
// payments
function unwrapItem(response) {
    return response?.data ?? response?.payment ?? response
}

// filtered (re-filtering matching rows is a no-op), and correct if it hasn't yet.

export const paymentsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // GET /payments/all-paymentes/ patmentsApi
        // Filters are sent as query params so the backend can do the heavy lifting once
        // it supports it; applyFiltersAndSort re-applies them client-side as a fallback.
        createBooking: builder.mutation({
            query: (payload) => ({
                url: "/bookings/new-booking",
                method: "POST",
                body: payload,
            }),

            invalidatesTags: [{ type: "Booking", id: "LIST" }],
        }),
        initiatePayment: builder.mutation({
            query: ({ bookingID, method, amount }) => ({
                url: "/payments/initiate",
                method: "POST",
                body: {
                    bookingID,
                    method,
                    amount,
                },
            }),
            invalidatesTags: (result, error, { bookingID }) => [
                { type: "Booking", id: bookingID },
                { type: "Booking", id: "LIST" },
            ],
        }),
        searchPayments: builder.query({
            query: ({ page, limit } = {}) => ({
                url: `/payments/all-payments${buildQueryString({ page, limit })}`,
            }),
            transformResponse: (response) => unwrapList(response),
            // Per-item tags (not just a blanket 'Buses' tag) so a mutation on one payment can
            // invalidate just that row's cache entry instead of every search variant.
            providesTags: (result) =>
                result
                ? [...result.map((payment) => ({ type: 'Payments', id: payment.id })), { type: 'Payments', id: 'LIST' }]
              : [{ type: 'Payments', id: 'LIST' }],
        }),

        getPaymentById: builder.query({
            query: (payment_id) => `/payments/payment/${payment_id}`,
            transformResponse: (response) => unwrapItem(response),
            providesTags: (result, error, payment_id) => [{ type: 'Payments', id: payment_id }],
        }),
    }),
})

export const { useSearchPaymentsQuery, useGetPaymentyIdQuery, useCreateBookingMutation, useInitiatePaymentMutation } = paymentsApi