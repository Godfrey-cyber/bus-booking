import { HiOutlineViewGrid, HiOutlineQrcode, HiOutlineShieldCheck, HiOutlineClock } from 'react-icons/hi'
import Container from '../../../components/common/Container'
import Card from '../../../components/common/Card'

const REASONS = [
  {
    icon: <HiOutlineViewGrid className="h-5 w-5" />,
    title: 'Pick your exact seat',
    description: 'A live seat map shows what\u2019s open before you pay — no surprises at boarding.',
  },
  {
    icon: <HiOutlineQrcode className="h-5 w-5" />,
    title: 'Board with a QR code',
    description: 'Your ticket lives on your phone. Operators scan it, you walk on.',
  },
  {
    icon: <HiOutlineShieldCheck className="h-5 w-5" />,
    title: 'Fair cancellations',
    description: 'See your refund eligibility and any fee upfront, before you cancel.',
  },
  {
    icon: <HiOutlineClock className="h-5 w-5" />,
    title: 'Real-time updates',
    description: 'Departure changes and boarding reminders land the moment they happen.',
  },
]

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="bg-fleet-charcoal py-16 sm:py-20">
      <Container>
        <span className="font-mono text-xs uppercase tracking-widest text-fleet-yellow">Why FleetGo</span>
        <h2 className="mt-2 max-w-lg font-display text-2xl font-bold text-fleet-white sm:text-3xl">
          Built around the parts of bus travel that usually go wrong.
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((r) => (
            <Card key={r.title} className="border-white/10 bg-white/[0.04] p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-fleet-yellow text-fleet-black">
                {r.icon}
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-fleet-white">{r.title}</h3>
              <p className="mt-1.5 text-sm text-white/55">{r.description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}
