import { useState } from 'react'
import { HiChevronDown } from 'react-icons/hi'
import Container from '../../../components/common/Container'
import { FAQS } from '../../../mock/landingData'
import { cn } from '../../../utils/cn'

export default function FAQ() {
  const [openId, setOpenId] = useState(FAQS[0].id)

  return (
    <section id="faq" className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <span className="font-mono text-xs uppercase tracking-widest text-fleet-yellow-dark">FAQ</span>
        <h2 className="mt-2 font-display text-2xl font-bold text-fleet-black sm:text-3xl">
          Common questions
        </h2>

        <div className="mt-8 divide-y divide-fleet-black/[0.06] rounded-2xl border border-fleet-black/[0.06] bg-fleet-white">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id
            return (
              <div key={faq.id}>
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-medium text-fleet-black">{faq.question}</span>
                  <HiChevronDown
                    className={cn('h-5 w-5 shrink-0 text-fleet-gray transition-transform', isOpen && 'rotate-180 text-fleet-yellow-dark')}
                  />
                </button>
                <div className={cn('grid transition-all', isOpen ? 'grid-rows-[1fr] pb-4' : 'grid-rows-[0fr]')} style={{ display: 'grid' }}>
                  <div className="overflow-hidden px-5">
                    <p className="text-sm text-fleet-gray">{faq.answer}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
