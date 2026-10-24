import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Toaster from '../components/common/Toaster'

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-fleet-light">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}
