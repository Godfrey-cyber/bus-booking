import { HiOutlineTicket } from 'react-icons/hi'
import Container from '../../../components/common/Container'

const OFFERS = [
  { id: 'o1', code: 'FIRSTRIDE', detail: '15% off your first booking', expiry: 'Ends 31 Aug' },
  { id: 'o2', code: 'WEEKENDER', detail: 'KES 200 off Friday–Sunday travel', expiry: 'Ongoing' },
  { id: 'o3', code: 'GROUP5', detail: '10% off for 5+ passengers on one booking', expiry: 'Ends 15 Sep' },
]

export default function TravelOffers() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <span className="font-mono text-xs uppercase tracking-widest text-fleet-yellow-dark">Travel offers</span>
        <h2 className="mt-2 font-display text-2xl font-bold text-fleet-black sm:text-3xl">
          Current promo codes
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {OFFERS.map((offer) => (
            <div
              key={offer.id}
              className="ticket-perforation flex items-center gap-4 rounded-2xl border border-dashed border-fleet-yellow-dark/40 bg-fleet-yellow/10 p-5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-fleet-yellow text-fleet-black">
                <HiOutlineTicket className="h-5 w-5" />
              </div>
              <div>
                <p className="font-mono text-sm font-bold tracking-wide text-fleet-black">{offer.code}</p>
                <p className="mt-0.5 text-sm text-fleet-charcoal">{offer.detail}</p>
                <p className="mt-1 text-xs text-fleet-gray">{offer.expiry}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
