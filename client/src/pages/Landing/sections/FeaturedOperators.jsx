import { HiStar } from 'react-icons/hi'
import Container from '../../../components/common/Container'
import Card from '../../../components/common/Card'
import Badge from '../../../components/common/Badge'
import { FEATURED_OPERATORS } from '../../../mock/landingData'

export default function FeaturedOperators() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <span className="font-mono text-xs uppercase tracking-widest text-fleet-yellow-dark">On the road</span>
        <h2 className="mt-2 font-display text-2xl font-bold text-fleet-black sm:text-3xl">Featured operators</h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_OPERATORS.map((op) => (
            <Card key={op.id} className="p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-fleet-yellow/15 font-display font-bold text-fleet-yellow-dark">
                {op.name.charAt(0)}
              </div>
              <h3 className="mt-3 font-display font-semibold text-fleet-black">{op.name}</h3>
              <div className="mt-1 flex items-center gap-1 text-sm text-fleet-gray">
                <HiStar className="h-4 w-4 text-fleet-yellow-dark" />
                {op.rating} · {op.trips} trips/mo
              </div>
              <Badge tone="yellow" className="mt-3">
                {op.tag}
              </Badge>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}
