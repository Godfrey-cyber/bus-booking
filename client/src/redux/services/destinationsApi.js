import { apiSlice } from './apiSlice'

export const destinationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get paginated destinations for the authenticated operator
     */
    getOperatorDestinations: builder.query({
      query: ({ page = 1, limit = 20 } = {}) => ({
        url: '/destinations/all-destinations',
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
        url: '/destinations/new-destination',
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