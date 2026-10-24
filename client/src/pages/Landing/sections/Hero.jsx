import { motion } from 'framer-motion'
import Container from '../../../components/common/Container'
import RouteSearchForm from '../../../components/search/RouteSearchForm'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-fleet-black pb-28 pt-14 sm:pb-36 sm:pt-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, var(--color-fleet-yellow) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true"
      />
      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-fleet-yellow/15 px-3 py-1 font-mono text-xs uppercase tracking-wide text-fleet-yellow">
            Boarding now · 40+ operators
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] text-fleet-white sm:text-6xl">
            Your seat, <span className="text-fleet-yellow">reserved</span>, before you leave the house.
          </h1>
          <p className="mt-5 max-w-md text-base text-white/60 sm:text-lg">
            Compare intercity bus operators, pick your exact seat on a live map, and board with a QR
            ticket. No queues, no guesswork.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10"
        >
          <RouteSearchForm />
        </motion.div>
      </Container>
    </section>
  )
}
