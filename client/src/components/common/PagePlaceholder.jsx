import Container from './Container'

// Temporary placeholder for pages scheduled in a later build phase.
// Swapped out page-by-page as each phase is implemented — never linked to from the Landing page.
export default function PagePlaceholder({ title, phase }) {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="font-mono text-xs uppercase tracking-widest text-fleet-yellow-dark">{phase}</span>
      <h1 className="mt-3 font-display text-3xl font-bold text-fleet-black">{title}</h1>
      <p className="mt-2 max-w-sm text-sm text-fleet-gray">This page is scaffolded and will be built in an upcoming phase.</p>
    </Container>
  )
}
