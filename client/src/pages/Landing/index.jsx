import Hero from './sections/Hero'
import PopularDestinations from './sections/PopularDestinations'
import TravelOffers from './sections/TravelOffers'
import FeaturedOperators from './sections/FeaturedOperators'
import WhyChooseUs from './sections/WhyChooseUs'
import Testimonials from './sections/Testimonials'
import AppDownload from './sections/AppDownload'
import FAQ from './sections/FAQ'

export default function LandingPage() {
  return (
    <>
      <Hero />
      <PopularDestinations />
      <TravelOffers />
      <FeaturedOperators />
      <WhyChooseUs />
      <Testimonials />
      <AppDownload />
      <FAQ />
    </>
  )
}
