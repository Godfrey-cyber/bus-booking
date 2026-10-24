import { useState } from 'react'
import { HiOutlineChat } from 'react-icons/hi'
import Card from '../../../components/common/Card'
import Badge from '../../../components/common/Badge'
import Button from '../../../components/common/Button'
import EmptyState from '../../../components/common/EmptyState'
import { SUPPORT_TICKETS } from '../../../mock/adminData'
import { formatDate, formatTime } from '../../../utils/format'
import { useToast } from '../../../hooks/useToast'
import { cn } from '../../../utils/cn'

const STATUS_TONE = { open: 'error', in_progress: 'warning', resolved: 'success', closed: 'neutral' }
const PRIORITY_TONE = { low: 'neutral', medium: 'info', high: 'warning', urgent: 'error' }

export default function AdminSupportTickets() {
  const [tickets, setTickets] = useState(SUPPORT_TICKETS)
  const [selectedId, setSelectedId] = useState(SUPPORT_TICKETS[0]?.id ?? null)
  const [reply, setReply] = useState('')
  const toast = useToast()

  const selected = tickets.find((t) => t.id === selectedId)

  const sendReply = () => {
    if (!reply.trim()) return
    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedId
          ? { ...t, status: t.status === 'open' ? 'in_progress' : t.status, replies: [...t.replies, { from: 'Support', message: reply, at: new Date().toISOString() }] }
          : t
      )
    )
    setReply('')
    toast.success('Reply sent.')
  }

  const setStatus = (status) => {
    setTickets((prev) => prev.map((t) => (t.id === selectedId ? { ...t, status } : t)))
    toast.success('Ticket status updated.')
  }

  if (tickets.length === 0) {
    return <EmptyState icon={<HiOutlineChat />} title="No support tickets" description="Passenger and operator issues will show up here." />
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-fleet-black">Support tickets</h1>
      <p className="mt-1 text-sm text-fleet-gray">Passenger and operator issues awaiting a response.</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="flex flex-col gap-2">
          {tickets.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedId(t.id)}
              className={cn(
                'rounded-xl border p-3.5 text-left transition-colors',
                selectedId === t.id ? 'border-fleet-yellow-dark bg-fleet-yellow/[0.06]' : 'border-fleet-black/[0.06] bg-fleet-white hover:border-fleet-black/15'
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-fleet-black">{t.subject}</p>
                <Badge tone={PRIORITY_TONE[t.priority]}>{t.priority}</Badge>
              </div>
              <p className="mt-1 text-xs text-fleet-gray">{t.user} · {formatDate(t.createdAt)}</p>
              <Badge tone={STATUS_TONE[t.status]} className="mt-2">{t.status.replace('_', ' ')}</Badge>
            </button>
          ))}
        </div>

        {selected && (
          <Card className="flex flex-col p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-fleet-black/[0.06] pb-4">
              <div>
                <h2 className="font-display text-base font-semibold text-fleet-black">{selected.subject}</h2>
                <p className="text-xs text-fleet-gray">Raised by {selected.user}</p>
              </div>
              <div className="flex gap-2">
                {selected.status !== 'resolved' && (
                  <Button size="sm" variant="outline" onClick={() => setStatus('resolved')}>Mark resolved</Button>
                )}
                {selected.status !== 'closed' && (
                  <Button size="sm" variant="ghost" onClick={() => setStatus('closed')}>Close</Button>
                )}
              </div>
            </div>

            <div className="mt-4 flex max-h-80 flex-col gap-3 overflow-y-auto">
              {selected.replies.map((r, i) => (
                <div key={i} className={cn('max-w-[80%] rounded-xl p-3 text-sm', r.from === 'Support' ? 'ml-auto bg-fleet-black text-fleet-white' : 'bg-fleet-light text-fleet-charcoal')}>
                  <p>{r.message}</p>
                  <p className={cn('mt-1 text-[11px]', r.from === 'Support' ? 'text-white/50' : 'text-fleet-gray')}>
                    {r.from} · {formatDate(r.at)} {formatTime(r.at)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2 border-t border-fleet-black/[0.06] pt-4">
              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type a reply…"
                className="flex-1 rounded-xl border border-fleet-black/10 px-3.5 py-2.5 text-sm focus:border-fleet-yellow-dark focus:outline-none"
                onKeyDown={(e) => e.key === 'Enter' && sendReply()}
              />
              <Button onClick={sendReply}>Send</Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
