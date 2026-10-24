import { HiOutlineDeviceMobile } from 'react-icons/hi'
import Container from '../../../components/common/Container'
import Button from '../../../components/common/Button'

export default function AppDownload() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-fleet-yellow px-6 py-12 sm:px-14 sm:py-16">
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-fleet-black/5"
            aria-hidden="true"
          />
          <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-md">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-fleet-black text-fleet-yellow">
                <HiOutlineDeviceMobile className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-2xl font-bold text-fleet-black sm:text-3xl">
                Take FleetGo on the road
              </h2>
              <p className="mt-2 text-sm text-fleet-black/70">
                Get live boarding alerts and your QR ticket in one tap — download the app for iOS and
                Android.
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <Button variant="dark" size="lg">App Store</Button>
              <Button variant="outline" size="lg" className="border-fleet-black/30">
                Google Play
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
