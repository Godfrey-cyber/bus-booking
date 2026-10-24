import Container from '../../../components/common/Container'
import { TESTIMONIALS } from '../../../mock/landingData'

export default function Testimonials() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <span className="font-mono text-xs uppercase tracking-widest text-fleet-yellow-dark">Passenger stories</span>
        <h2 className="mt-2 font-display text-2xl font-bold text-fleet-black sm:text-3xl">
          What riders are saying
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.id} className="rounded-2xl border border-fleet-black/[0.06] bg-fleet-white p-6">
              <blockquote className="font-display text-lg leading-snug text-fleet-black">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold text-fleet-black">{t.name}</span>
                <span className="text-fleet-gray"> · {t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  )
}
