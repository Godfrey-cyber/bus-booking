import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import {
  HiOutlineHome,
  HiOutlineBell,
  HiOutlineUserGroup,
  HiOutlineHeart,
  HiOutlineUserCircle,
  HiOutlineTicket,
  HiOutlineChartBar,
  HiOutlineTruck,
  HiOutlineMap,
  HiOutlineIdentification,
  HiOutlineClipboardList,
  HiOutlineQrcode,
  HiOutlineDocumentReport,
  HiOutlineOfficeBuilding,
  HiOutlineCash,
  HiOutlineExclamationCircle,
  HiOutlineChatAlt2,
  HiOutlineDocumentText,
  HiOutlineCog,
} from 'react-icons/hi'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'
import ErrorPage from '../pages/ErrorPage'
import Loader from '../components/common/Loader'
import { ROLES } from '../constants/roles'

const PASSENGER_NAV_ITEMS = [
  { to: '/dashboard', label: 'Overview', icon: <HiOutlineHome className="h-4.5 w-4.5" />, end: true },
  { to: '/my-bookings', label: 'My bookings', icon: <HiOutlineTicket className="h-4.5 w-4.5" /> },
  { to: '/dashboard/notifications', label: 'Notifications', icon: <HiOutlineBell className="h-4.5 w-4.5" /> },
  { to: '/dashboard/saved-travelers', label: 'Saved travelers', icon: <HiOutlineUserGroup className="h-4.5 w-4.5" /> },
  { to: '/dashboard/favorite-routes', label: 'Favorite routes', icon: <HiOutlineHeart className="h-4.5 w-4.5" /> },
  { to: '/dashboard/profile', label: 'Profile', icon: <HiOutlineUserCircle className="h-4.5 w-4.5" /> },
]

const OPERATOR_NAV_ITEMS = [
  { to: '/operator', label: 'Overview', icon: <HiOutlineChartBar className="h-4.5 w-4.5" />, end: true },
  { to: '/operator/buses', label: 'Buses', icon: <HiOutlineTruck className="h-4.5 w-4.5" /> },
  { to: '/operator/destinations', label: 'Destinations', icon: <HiOutlineTruck className="h-4.5 w-4.5" /> },
  { to: '/operator/schedules', label: 'Schedules', icon: <HiOutlineClipboardList className="h-4.5 w-4.5" /> },
  { to: '/operator/routes', label: 'Routes', icon: <HiOutlineMap className="h-4.5 w-4.5" /> },
  { to: '/operator/trips', label: 'Trips', icon: <HiOutlineMap className="h-4.5 w-4.5" /> },
  { to: '/operator/drivers', label: 'Drivers', icon: <HiOutlineIdentification className="h-4.5 w-4.5" /> },
  { to: '/operator/bookings', label: 'Bookings', icon: <HiOutlineTicket className="h-4.5 w-4.5" /> },
  { to: '/operator/scan', label: 'Scan tickets', icon: <HiOutlineQrcode className="h-4.5 w-4.5" /> },
  { to: '/operator/reports', label: 'Reports', icon: <HiOutlineDocumentReport className="h-4.5 w-4.5" /> },
]

const ADMIN_NAV_ITEMS = [
  { to: '/admin', label: 'Overview', icon: <HiOutlineChartBar className="h-4.5 w-4.5" />, end: true },
  { to: '/admin/operators', label: 'Operators', icon: <HiOutlineOfficeBuilding className="h-4.5 w-4.5" /> },
  { to: '/admin/bookings', label: 'Bookings', icon: <HiOutlineTicket className="h-4.5 w-4.5" /> },
  { to: '/admin/refunds', label: 'Refunds', icon: <HiOutlineExclamationCircle className="h-4.5 w-4.5" /> },
  { to: '/admin/payments', label: 'Payments', icon: <HiOutlineCash className="h-4.5 w-4.5" /> },
  { to: '/admin/support', label: 'Support tickets', icon: <HiOutlineChatAlt2 className="h-4.5 w-4.5" /> },
  { to: '/admin/analytics', label: 'Analytics', icon: <HiOutlineDocumentReport className="h-4.5 w-4.5" /> },
  { to: '/admin/audit-logs', label: 'Audit logs', icon: <HiOutlineDocumentText className="h-4.5 w-4.5" /> },
  { to: '/admin/settings', label: 'Settings', icon: <HiOutlineCog className="h-4.5 w-4.5" /> },
]

// Route-level code splitting — every page below is its own chunk.
const LandingPage = lazy(() => import('../pages/Landing'))
const SearchPage = lazy(() => import('../pages/Search'))
const BookingPage = lazy(() => import('../pages/Booking'))
const SeatSelectionPage = lazy(() => import('../pages/SeatSelection'))
const CheckoutPage = lazy(() => import('../pages/Checkout'))
const PaymentPage = lazy(() => import('../pages/Payment'))
const TicketPage = lazy(() => import('../pages/Ticket'))
const RefundPage = lazy(() => import('../pages/Refund'))
const MyBookingsPage = lazy(() => import('../pages/MyBookings'))
const LoginPage = lazy(() => import('../pages/Login'))
const RegisterPage = lazy(() => import('../pages/Register'))
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPassword'))
const ResetPasswordPage = lazy(() => import('../pages/ResetPassword'))
const PassengerOverview = lazy(() => import('../pages/Dashboard/Passenger/Overview'))
const PassengerNotifications = lazy(() => import('../pages/Dashboard/Passenger/Notifications'))
const SavedTravelers = lazy(() => import('../pages/Dashboard/Passenger/SavedTravelers'))
const FavoriteRoutes = lazy(() => import('../pages/Dashboard/Passenger/FavoriteRoutes'))
const PassengerProfile = lazy(() => import('../pages/Dashboard/Passenger/Profile'))
const OperatorOverview = lazy(() => import('../pages/Dashboard/Operator/Overview'))
const OperatorBuses = lazy(() => import('../pages/Dashboard/Operator/Buses'))
const OperatorDestinations = lazy(() => import('../pages/Dashboard/Operator/Destinations'))
const OperatorSchedules = lazy(() => import('../pages/Dashboard/Operator/Schedules'))
const OperatorRoutes = lazy(() => import('../pages/Dashboard/Operator/Routes'))
const OperatorTrips = lazy(() => import('../pages/Dashboard/Operator/Trips'))
const OperatorDrivers = lazy(() => import('../pages/Dashboard/Operator/Drivers'))
const OperatorBookings = lazy(() => import('../pages/Dashboard/Operator/Bookings'))
const OperatorScanTickets = lazy(() => import('../pages/Dashboard/Operator/ScanTickets'))
const OperatorReports = lazy(() => import('../pages/Dashboard/Operator/Reports'))
const AdminOverview = lazy(() => import('../pages/Dashboard/Admin/Overview'))
const AdminOperators = lazy(() => import('../pages/Dashboard/Admin/Operators'))
const AdminBookings = lazy(() => import('../pages/Dashboard/Admin/Bookings'))
const AdminRefunds = lazy(() => import('../pages/Dashboard/Admin/Refunds'))
const AdminPayments = lazy(() => import('../pages/Dashboard/Admin/Payments'))
const AdminSupportTickets = lazy(() => import('../pages/Dashboard/Admin/SupportTickets'))
const AdminAnalytics = lazy(() => import('../pages/Dashboard/Admin/Analytics'))
const AdminAuditLogs = lazy(() => import('../pages/Dashboard/Admin/AuditLogs'))
const AdminSettings = lazy(() => import('../pages/Dashboard/Admin/Settings'))

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader size={28} />
    </div>
  )
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Public site */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/trips/:trip_id" element={<BookingPage />} />

          {/* Booking flow requires an authenticated passenger */}
          <Route element={<ProtectedRoute />}>
            <Route path="/booking/:trip_id/seats/:bus_id" element={<SeatSelectionPage />} />
            <Route path="/booking/:trip_id/checkout" element={<CheckoutPage />} />
            <Route path="/booking/:trip_id/payment" element={<PaymentPage />} />
            <Route path="/tickets/:booking_id" element={<TicketPage />} />
            <Route path="/refund/:booking_id" element={<RefundPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
          </Route>

          <Route path="/unauthorized" element={<ErrorPage code="403" title="Unauthorized" description="You don't have access to this page." />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>

        {/* Auth */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Passenger dashboard */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout title="My Dashboard" navItems={PASSENGER_NAV_ITEMS} />}>
            <Route path="/dashboard" element={<PassengerOverview />} />
            <Route path="/dashboard/notifications" element={<PassengerNotifications />} />
            <Route path="/dashboard/saved-travelers" element={<SavedTravelers />} />
            <Route path="/dashboard/favorite-routes" element={<FavoriteRoutes />} />
            <Route path="/dashboard/profile" element={<PassengerProfile />} />
          </Route>

          {/* Operator dashboard */}
          <Route element={<RoleRoute allowedRoles={[ROLES.OPERATOR]} />}>
            <Route element={<DashboardLayout title="Operator" navItems={OPERATOR_NAV_ITEMS} />}>
                <Route path="/operator" element={<OperatorOverview />} />
                <Route path="/operator/buses" element={<OperatorBuses />} />
                <Route path="/operator/destinations" element={<OperatorDestinations />} />
                <Route path="/operator/schedules" element={<OperatorSchedules />} />
                <Route path="/operator/routes" element={<OperatorRoutes />} />
                <Route path="/operator/trips" element={<OperatorTrips />} />
                <Route path="/operator/drivers" element={<OperatorDrivers />} />
                <Route path="/operator/bookings" element={<OperatorBookings />} />
                <Route path="/operator/scan" element={<OperatorScanTickets />} />
                <Route path="/operator/reports" element={<OperatorReports />} />
            </Route>
          </Route>

          {/* Admin dashboard */}
          <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route element={<DashboardLayout title="Admin" navItems={ADMIN_NAV_ITEMS} />}>
                <Route path="/admin" element={<AdminOverview />} />
                <Route path="/admin/operators" element={<AdminOperators />} />
                <Route path="/admin/bookings" element={<AdminBookings />} />
                <Route path="/admin/refunds" element={<AdminRefunds />} />
                <Route path="/admin/payments" element={<AdminPayments />} />
                <Route path="/admin/support" element={<AdminSupportTickets />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Suspense>
  )
}
