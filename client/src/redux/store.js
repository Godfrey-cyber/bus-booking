import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './services/apiSlice'
import authReducer from './features/auth/authSlice'
import searchReducer from './features/search/searchSlice'
import cartReducer from './features/cart/cartSlice'
import bookingReducer from './features/booking/bookingSlice'
import tripsReducer from './features/trips/tripsSlice'
import busesReducer from './features/buses/busesSlice'
import driversReducer from './features/drivers/driversSlice'
import destinationsReducer from './features/destinations/destinationsSlice'
import operatorsReducer from './features/operators/operatorsSlice'
import seatsReducer from './features/seats/seatsSlice'
import routesFeatureReducer from './features/routes/routesSlice'
import paymentsReducer from './features/payments/paymentsSlice'
import notificationsReducer from './features/notifications/notificationsSlice'
import dashboardReducer from './features/dashboard/dashboardSlice'
import preferencesReducer from './features/preferences/preferencesSlice'
import uiReducer from './features/ui/uiSlice'

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        search: searchReducer,
        cart: cartReducer,
        booking: bookingReducer,
        buses: busesReducer,
        drivers: driversReducer,
        destinations: destinationsReducer,
        operators: operatorsReducer,
        seats: seatsReducer,
        trips: tripsReducer,
        routesFeature: routesFeatureReducer,
        payments: paymentsReducer,
        notifications: notificationsReducer,
        dashboard: dashboardReducer,
        preferences: preferencesReducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
})
