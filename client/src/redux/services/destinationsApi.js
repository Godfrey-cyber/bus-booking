import { apiSlice } from './apiSlice'

function unwrapList(response) {
    if (Array.isArray(response)) return response
    return response?.data ?? response?.drivers ?? []
}

function unwrapItem(response) {
    return response?.data ?? response?.driver ?? response
}

export const destinationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get paginated destinations for the authenticated operator
     */
    getOperatorDestinations: builder.query({
        query: ({ page = 1, limit = 20 } = {}) => ({
            url: "/locations/operator-locations",
            method: 'GET',
            params: { page, limit },
        }),
      // Provides tags for cache invalidation
        providesTags: (result) =>
            result?.data
            ? [
                ...result.data.map(({ id }) => ({ type: 'Destinations', id })),
                { type: 'Destinations', id: 'LIST' },
            ]
          : [{ type: 'Destinations', id: 'LIST' }],
    }),

        /**
        * Create a new destination (Operator only)
        */
    createDestination: builder.mutation({
      query: (destinationData) => ({
        url: "/locations/new-location",
        method: 'POST',
        body: destinationData,
      }),
      // Invalidates the list cache to automatically trigger a background refetch
      invalidatesTags: [{ type: 'Destinations', id: 'LIST' }],
    }),
  }),
});

// Auto-generated hooks for export
export const {
  useGetOperatorDestinationsQuery,
  useCreateDestinationMutation,
} = destinationsApi;