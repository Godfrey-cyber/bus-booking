import { apiSlice } from './apiSlice'

function unwrapList(response) {
    if (Array.isArray(response)) return response
    return response?.data ?? response?.routes ?? []
}

function unwrapItem(response) {
    return response?.data ?? response?.route ?? response
}

export const routesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get paginated routes for the authenticated operator
     */
    getOperatorRoutes: builder.query({
        query: ({ page = 1, limit = 20 } = {}) => ({
            url: "/routes/operator-routes",
            method: 'GET',
            params: { page, limit },
        }),
      // Provides tags for cache invalidation
        providesTags: (result) =>
            result?.data
            ? [
                ...result.data.map(({ id }) => ({ type: 'Routes', id })),
                { type: 'Routes', id: 'LIST' },
            ]
          : [{ type: 'Routes', id: 'LIST' }],
    }),

        /**
        * Create a new routes (Operator only)
        */
    createRoute: builder.mutation({
      query: (routeData) => ({
        url: "/routes/new-route",
        method: 'POST',
        body: routeData,
      }),
      // Invalidates the list cache to automatically trigger a background refetch
      invalidatesTags: [{ type: 'Routes', id: 'LIST' }],
    }),
  }),
});

// Auto-generated hooks for export
export const {
  useGetOperatorRoutesQuery,
  useCreateRouteMutation,
} = routesApi;