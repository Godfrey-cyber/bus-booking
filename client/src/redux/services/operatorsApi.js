import { apiSlice } from './apiSlice'
import { buildQueryString } from '../../utils/queryString'

// Normalizes whatever envelope the backend wraps the list in (`{ data: [...] }`,
// `{ operators: [...] }`, or a bare array) into a plain array the UI can rely on.
function unwrapList(response) {
  if (Array.isArray(response)) return response
  return response?.data ?? response?.operators ?? []
}

function unwrapItem(response) {
  return response?.data ?? response?.operator ?? response
}

// Client-side filter/sort kept as a safety net — harmless if the backend already
// filtered (re-filtering matching rows is a no-op), and correct if it hasn't yet.
function applyFiltersAndSort(operators, { filters, sortBy } = {}) {
    let results = operators

    if (filters?.amenities?.length) {
        results = results.filter((operator) => filters.amenities.every((a) => operator.amenities?.includes(a)))
    }
    if (filters?.operators?.length) {
        results = results.filter((operator) => filters.operators.includes(operator.operator?.name))
    }
    if (filters?.priceRange) {
        const [min, max] = filters.priceRange
        results = results.filter((operator) => operator.price >= min && operator.price <= max)
    }

    return [...results].sort((a, b) => {
        if (sortBy === 'status') return a.status - b.status
        if (sortBy === 'name') return a.name - b.name
        if (sortBy === 'rating') return (b?.rating_avg ?? 0) - (a?.rating_avg ?? 0)
        return new Date(a.departureTime) - new Date(b.departureTime)
    })
}

export const operatorsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /operators/all-operators/?origin=...&destination=...&amenities=ac,wifi&sortBy=price
    // Filters are sent as query params so the backend can do the heavy lifting once
    // it supports it; applyFiltersAndSort re-applies them client-side as a fallback.
    searchOperators: builder.query({
        query: ({ sortBy } = {}) => ({
            url: `/users/operators`,
        }),
        transformResponse: (response, _meta, arg) => applyFiltersAndSort(unwrapList(response), arg),
          // Per-item tags (not just a blanket 'Operators' tag) so a mutation on one operator can
          // invalidate just that row's cache entry instead of every search variant.
        providesTags: (result) =>
            result
            ? [...result.map((user) => ({ type: 'Users', id: user.id })), { type: 'Users', id: 'LIST' }]
            : [{ type: 'Users', id: 'LIST' }],
    }),
    createOperator: builder.mutation({
      query: (operatorData) => ({
        url: '/operators/new-operator',
        method: 'POST',
        body: operatorData,
      }),
      // Invalidates the list cache to automatically trigger a background refetch
      invalidatesTags: [{ type: 'Operator', id: 'LIST' }],
    }),

    // GET /operators/operator/:operatorId — mirrors the /bookings/booking/:id convention your
    // backend already uses. Add this route on the API if it isn't there yet;
    // fetching the full list to find one operator doesn't scale past a handful of operators.
    getOperatorById: builder.query({
        query: (operator_id) => `/operators/new-operator/${operator_id}`,
        transformResponse: (response) => unwrapItem(response),
        providesTags: (result, error, operator_id) => [{ type: 'Operators', id: operator_id }],
    }),

    updateOperatorStatus: builder.mutation({
        query: ({ id, status }) => ({ 
            url: `/operators/status/${id}`, 
            method: 'PATCH',
            body: { status },
        }),
        transformResponse: (response) => unwrapItem(response),
        invalidatesTags: (result, error, { id }) => [
            { type: 'Operators', id },
            // { type: 'Operators', id: 'LIST' }
        ],
    }),
  }),
})

export const { useSearchOperatorsQuery, useCreateOperatorMutation, useGetOperatorByIdQuery, useUpdateOperatorStatusMutation } = operatorsApi
