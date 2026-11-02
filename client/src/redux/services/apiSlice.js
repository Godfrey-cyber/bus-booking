
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { logout } from '../features/auth/authSlice'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1'

// Base RTK Query API — every feature endpoint (auth, buses, bookings, ...) injects
// into this one instance so they share a single cache, a single set of tag types,
// and a single auth header strategy.
// export const apiSlice = createApi({
//     reducerPath: 'api',
//     baseQuery: fetchBaseQuery({
//         baseUrl: BASE_URL,
//         prepareHeaders: (headers, { getState }) => {
//             const token = getState().auth?.accessToken
//             if (token) headers.set('Authorization', `Bearer ${token}`)
//             headers.set('Accept', 'application/json')
//             console.log("auth token", token)
//             console.log("headers", headers)
//             console.log("BASE_URL", BASE_URL)
//             return headers
//         },
//     }),
//   tagTypes: ['Auth', 'Buses', 'Routes', 'Seats', 'Booking', 'Payment', 'Notifications', 'Dashboard'],
//   endpoints: () => ({}),
// })

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth?.accessToken
        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }
        // console.log("auth token", token)
        headers.set('Accept', 'application/json')
        return headers
    },
})

// Custom baseQuery wrapper to handle expired/invalid tokens globally
const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)
    // console.log("result", result?.data?.data)
    // console.log("result", result?.data)
    if (result?.error && result.error.status === 401) {
        // Token is expired or invalid -> log the user out
        api.dispatch(logout())
    }

    return result // invalidatesTags
}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Auth", 'Buses', 'Routes', 'Operators', 'Seats', 'Booking', 'Payment', 'Notifications', 'Dashboard'],
    endpoints: () => ({}),
})