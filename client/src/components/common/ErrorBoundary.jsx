import { Component } from 'react'
import ErrorPage from '../../pages/ErrorPage'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // In production this reports to an error-tracking service.
    console.error('Unhandled UI error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          code="500"
          title="Something broke on our end"
          description="Try refreshing the page. If this keeps happening, let us know."
        />
      )
    }
    return this.props.children
  }
}
