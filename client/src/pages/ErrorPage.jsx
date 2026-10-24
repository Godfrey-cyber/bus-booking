import { Link } from 'react-router-dom'
import Button from '../components/common/Button'
import Container from '../components/common/Container'

export default function ErrorPage({
  code = '404',
  title = 'Route not found',
  description = "The page you're looking for has left the station.",
}) {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <span className="font-mono text-sm tracking-widest text-fleet-yellow-dark">ERROR {code}</span>
      <h1 className="mt-3 font-display text-4xl font-bold text-fleet-black sm:text-5xl">{title}</h1>
      <p className="mt-3 max-w-md text-fleet-gray">{description}</p>
      <Button as={Link} to="/" className="mt-8">
        Back to home
      </Button>
    </Container>
  )
}
