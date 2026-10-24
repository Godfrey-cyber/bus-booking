import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import ErrorBoundary from './components/common/ErrorBoundary'
import { useSessionRestore } from './hooks/useSessionRestore'

function SessionGate({ children }) {
  useSessionRestore()
  return children
}

export default function App() {
  return (
    <BrowserRouter>
        <ErrorBoundary>
            <SessionGate>
                <AppRoutes />
            </SessionGate>
        </ErrorBoundary>
    </BrowserRouter>
  )
}
