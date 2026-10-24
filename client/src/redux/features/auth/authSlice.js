
import { createSlice } from '@reduxjs/toolkit'

// Helper to safely pull initial session state
const getStoredAuth = () => {
    try {
        const stored = localStorage.getItem('auth') || sessionStorage.getItem('auth')
        if (!stored) return null
        return JSON.parse(stored)
    } catch (error) {
        return null
    }
}

const storedAuth = getStoredAuth()

const initialState = {
    user: storedAuth?.user ?? null,
    accessToken: storedAuth?.accessToken ?? storedAuth?.token ?? null,
    isAuthenticated: Boolean(storedAuth?.accessToken || storedAuth?.token),
    status: 'idle',
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials(state, action) {
            const { user, accessToken } = action.payload
            // console.log("action.payload", action.payload)
            console.log("accessToken", accessToken)
            // console.log("user", user)
            state.user = user
            state.accessToken = accessToken
            state.isAuthenticated = Boolean(accessToken)
        },
        logout(state) {
            state.user = null
            state.accessToken = null
            state.isAuthenticated = false
            localStorage.removeItem('auth')
            sessionStorage.removeItem('auth')
        },
        setAuthStatus(state, action) {
            state.status = action.payload
        },
    },
})

export const { setCredentials, logout, setAuthStatus } = authSlice.actions
export default authSlice.reducer

export const selectCurrentUser = (state) => state.auth.user
export const selectAccessToken = (state) => state.auth.accessToken
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectUserRole = (state) => state.auth.user?.role ?? null
