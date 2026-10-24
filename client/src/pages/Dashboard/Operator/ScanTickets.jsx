import { useState } from 'react'
import { HiOutlineQrcode, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi'
import Card from '../../../components/common/Card'
import Button from '../../../components/common/Button'
import { OPERATOR_BOOKINGS } from '../../../mock/operatorData'

export default function ScanTickets() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState(null) // { ok: bool, booking? }

  const handleLookup = (e) => {
    e.preventDefault()
    const booking = OPERATOR_BOOKINGS.find((b) => b.reference.toLowerCase() === code.trim().toLowerCase())
    if (!booking) {
      setResult({ ok: false })
      return
    }
    setResult({ ok: booking.status !== 'cancelled', booking })
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-fleet-black">Scan QR tickets</h1>
      <p className="mt-1 text-sm text-fleet-gray">Verify passenger tickets at boarding.</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="flex flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="flex h-40 w-40 items-center justify-center rounded-2xl border-2 border-dashed border-fleet-black/15 bg-fleet-light/60 text-fleet-gray">
            <HiOutlineQrcode className="h-16 w-16" />
          </div>
          <p className="text-sm text-fleet-gray">
            Camera scanning connects here once the device camera API is wired up. For now, enter a booking
            reference to simulate a scan.
          </p>
          <form onSubmit={handleLookup} className="flex w-full max-w-xs gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. FG-8X29QK"
              className="w-full rounded-xl border border-fleet-black/10 px-3.5 py-2.5 text-sm font-mono uppercase focus:border-fleet-yellow-dark focus:outline-none"
            />
            <Button type="submit">Verify</Button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-sm font-semibold text-fleet-black">Scan result</h2>
          {!result && <p className="mt-4 text-sm text-fleet-gray">Verify a ticket to see its details here.</p>}

          {result && !result.ok && !result.booking && (
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-state-error/10 p-4">
              <HiOutlineXCircle className="h-6 w-6 shrink-0 text-state-error" />
              <div>
                <p className="font-medium text-state-error">Ticket not found</p>
                <p className="text-sm text-fleet-gray">No booking matches that reference.</p>
              </div>
            </div>
          )}

          {result?.booking && (
            <div
              className={`mt-4 flex items-start gap-3 rounded-xl p-4 ${
                result.ok ? 'bg-state-success/10' : 'bg-state-error/10'
              }`}
            >
              {result.ok ? (
                <HiOutlineCheckCircle className="h-6 w-6 shrink-0 text-state-success" />
              ) : (
                <HiOutlineXCircle className="h-6 w-6 shrink-0 text-state-error" />
              )}
              <div>
                <p className={`font-medium ${result.ok ? 'text-state-success' : 'text-state-error'}`}>
                  {result.ok ? 'Valid ticket — allow boarding' : 'This booking was cancelled'}
                </p>
                <p className="mt-1 text-sm text-fleet-charcoal">{result.booking.passenger}</p>
                <p className="text-sm text-fleet-gray">
                  {result.booking.route} · Seats {result.booking.seats.join(', ')}
                </p>
                <p className="mt-1 font-mono text-xs text-fleet-gray">{result.booking.reference}</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
