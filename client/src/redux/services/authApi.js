import { apiSlice } from './apiSlice'
import { MOCK_USERS } from '../../mock/users'

function unwrapList(response) {
  if (Array.isArray(response)) return response
  return response?.data ?? response?.users ?? []
}

// Mock-backed auth endpoints. Each queryFn simulates network latency and validation
// so the UI (loading/error states, forms) behaves exactly as it will against the real API.
export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "/users/login-user",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["Auth"],
        }),

        registerOperator: builder.mutation({
            query: (credentials) => ({
                url: "/users/register/operator",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["Auth"],
        }),

        registerPassenger: builder.mutation({
            query: (credentials) => ({
                url: "/users/register/passenger",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["Auth"],
        }),
        getOperators: builder.query({
        query: ({ sortBy } = {}) => ({
            url: `/users/operators`,
        }),
        transformResponse: (response) => (unwrapList(response)),
          // Per-item tags (not just a blanket 'Operators' tag) so a mutation on one operator can
          // invalidate just that row's cache entry instead of every search variant.
        providesTags: (result) =>
            result
            ? [...result.map((user) => ({ type: 'Users', id: user.id })), { type: 'Users', id: 'LIST' }]
            : [{ type: 'Users', id: 'LIST' }],
    }),

        // forgotPassword: builder.mutation({
        //     queryFn: async ({ email }) => {
        //         await delay(600)
        //         return { data: { message: `If an account exists for ${email}, a reset link has been sent.` } }
        //     },
        // }),
        // resetPassword: builder.mutation({
        //     queryFn: async () => {
        //         await delay(600)
        //         return { data: { message: 'Password updated successfully.' } }
        //     },
        // }),
    }),
})

export const {
    useLoginMutation,
    useRegisterOperatorMutation,
    useOperatorMutation,
    useRegisterPassengerMutation,
    useGetOperatorsQuery,
    useResetPasswordMutation,
    useForgotPasswordMutation
} = authApi
