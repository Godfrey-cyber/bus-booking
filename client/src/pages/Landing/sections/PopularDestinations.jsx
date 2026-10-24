import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { HiArrowRight } from 'react-icons/hi'
import Container from '../../../components/common/Container'
import { POPULAR_DESTINATIONS } from '../../../mock/landingData'
import { formatCurrency } from '../../../utils/format'
import { setSearchParams } from '../../../redux/features/search/searchSlice'

const GRADIENTS = [
  'from-amber-500/80 to-fleet-black',
  'from-emerald-600/70 to-fleet-black',
  'from-sky-600/70 to-fleet-black',
  'from-rose-600/70 to-fleet-black',
  'from-violet-600/70 to-fleet-black',
  'from-orange-600/70 to-fleet-black',
]

export default function PopularDestinations() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const goSearch = (city) => {
    dispatch(setSearchParams({ origin: 'Nairobi', destination: city }))
    navigate('/search')
  }

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="flex items-end justify-between">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-fleet-yellow-dark">
              Where to next
            </span>
            <h2 className="mt-2 font-display text-2xl font-bold text-fleet-black sm:text-3xl">
              Popular destinations
            </h2>
          </div>
        </div>

        <div className="mt-8 flex gap-4 overflow-x-auto pb-2 scrollbar-none sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-6">
          {POPULAR_DESTINATIONS.map((dest, i) => (
            <div
              key={dest.id}
              onClick={() => goSearch(dest.city)}
              className={`group relative h-40 min-w-[160px] flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br p-4 text-left shadow-md transition-transform hover:-translate-y-1 sm:min-w-0 ${GRADIENTS[i % GRADIENTS.length]}`}
            >
              <div className="absolute bottom-4 left-5 flex h-full z-50 flex-col justify-end text-white">
                <p className="font-display text-lg font-semibold">{dest.city}</p>
                <p className="flex items-center gap-1 font-bold text-xs text-white/75">
                  From {formatCurrency(dest.fromPrice)}
                  <HiArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </p>
              </div>
              <img className="absolute inset-0 h-full w-full object-cover z-0" src={dest.image} alt="" />
              {/*<div className="absolute inset-0 bg-black/40 z-10" />*/}
              {/*<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />*/}
              <div className="absolute inset-0 bg-black/45 backdrop-brightness-75 z-10" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
