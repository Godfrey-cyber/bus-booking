import { apiSlice } from './apiSlice'

function unwrapList(response) {
    if (Array.isArray(response)) return response
    return response?.data ?? response?.schedules ?? []
}

function unwrapItem(response) {
    return response?.data ?? response?.schedule ?? response
}

export const schedulesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get paginated schedules for the authenticated operator
     */
    getOperatorSchedules: builder.query({
        query: ({ page = 1, limit = 20 } = {}) => ({
            url: "/schedules/operator-schedules",
            method: 'GET',
            params: { page, limit },
        }),
      // Provides tags for cache invalidation
        providesTags: (result) =>
            result?.data
            ? [
                ...result.data.map(({ id }) => ({ type: 'Schedules', id })),
                { type: 'Schedules', id: 'LIST' },
            ]
          : [{ type: 'Schedules', id: 'LIST' }],
    }),

        /**
        * Create a new Schedules (Operator only)
        */
    createSchedule: builder.mutation({
      query: (routeData) => ({
        url: "/schedules/new-schedule",
        method: 'POST',
        body: routeData,
      }),
      // Invalidates the list cache to automatically trigger a background refetch
      invalidatesTags: [{ type: 'Schedules', id: 'LIST' }],
    }),
  }),
});

// Auto-generated hooks for export
export const {
  useGetOperatorSchedulesQuery,
  useCreateScheduleMutation,
} = schedulesApi;