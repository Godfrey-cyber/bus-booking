import { useState } from 'react'
import { HiOutlineClock, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineEye } from 'react-icons/hi'
import DataTable from '../../../components/dashboard/DataTable'
import Badge from '../../../components/common/Badge'
import Button from '../../../components/common/Button'
import Modal from '../../../components/common/Modal'
import ConfirmDialog from '../../../components/common/ConfirmDialog'
import { ADMIN_REFUNDS } from '../../../mock/adminData'
import { formatCurrency, formatDate, formatTime } from '../../../utils/format'
import { useToast } from '../../../hooks/useToast'
import { cn } from '../../../utils/cn'

const STATUS_TONE = { pending: 'warning', approved: 'info', processing: 'info', completed: 'success', rejected: 'error' }
const NEXT_STATUS = { pending: 'approved', approved: 'processing', processing: 'completed' }
const NEXT_LABEL = { pending: 'Approve', approved: 'Mark processing', processing: 'Mark completed' }

export default function AdminRefunds() {
  const [refunds, setRefunds] = useState(ADMIN_REFUNDS)
  const [viewing, setViewing] = useState(null)
  const [rejectTarget, setRejectTarget] = useState(null)
  const toast = useToast()

  const advance = (refund) => {
    const next = NEXT_STATUS[refund.status]
    if (!next) return
    setRefunds((prev) =>
      prev.map((r) =>
        r.id === refund.id
          ? { ...r, status: next, timeline: [...r.timeline, { status: next, note: `Marked ${next} by admin`, at: new Date().toISOString() }] }
          : r
      )
    )
    toast.success(`Refund moved to ${next}.`)
  }

  const confirmReject = () => {
    setRefunds((prev) =>
      prev.map((r) =>
        r.id === rejectTarget.id
          ? { ...r, status: 'rejected', timeline: [...r.timeline, { status: 'rejected', note: 'Rejected by admin', at: new Date().toISOString() }] }
          : r
      )
    )
    toast.success('Refund rejected.')
    setRejectTarget(null)
  }

  const columns = [
    { key: 'reference', label: 'Booking ref', render: (row) => <span className="font-mono text-xs">{row.reference}</span> },
    { key: 'passenger', label: 'Passenger' },
    { key: 'reason', label: 'Reason' },
    { key: 'amount', label: 'Amount', render: (row) => formatCurrency(row.amount) },
    { key: 'status', label: 'Status', render: (row) => <Badge tone={STATUS_TONE[row.status]}>{row.status}</Badge> },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex gap-1">
          <button onClick={() => setViewing(row)} className="rounded-lg p-1.5 text-fleet-gray hover:bg-fleet-black/5 hover:text-fleet-black" aria-label="View timeline">
            <HiOutlineEye className="h-4 w-4" />
          </button>
          {NEXT_STATUS[row.status] && (
            <Button size="sm" variant="outline" leftIcon={<HiOutlineCheckCircle className="h-3.5 w-3.5" />} onClick={() => advance(row)}>
              {NEXT_LABEL[row.status]}
            </Button>
          )}
          {(row.status === 'pending' || row.status === 'approved') && (
            <Button size="sm" variant="danger" leftIcon={<HiOutlineXCircle className="h-3.5 w-3.5" />} onClick={() => setRejectTarget(row)}>
              Reject
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-fleet-black">Refunds</h1>
      <p className="mt-1 text-sm text-fleet-gray">Review and progress refund requests through to completion.</p>

      <div className="mt-6">
        <DataTable columns={columns} rows={refunds} emptyLabel="No refund requests" />
      </div>

      <Modal isOpen={!!viewing} onClose={() => setViewing(null)} title="Refund timeline">
        {viewing && (
          <div>
            <p className="text-sm text-fleet-gray">
              <span className="font-mono">{viewing.reference}</span> · {formatCurrency(viewing.amount)}
            </p>
            <ol className="mt-4 flex flex-col gap-4 border-l border-fleet-black/10 pl-4">
              {viewing.timeline.map((event, i) => (
                <li key={i} className="relative">
                  <span
                    className={cn(
                      'absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full',
                      i === viewing.timeline.length - 1 ? 'bg-fleet-yellow-dark' : 'bg-fleet-black/20'
                    )}
                  />
                  <p className="text-sm font-medium capitalize text-fleet-black">{event.status}</p>
                  <p className="text-sm text-fleet-gray">{event.note}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-fleet-gray/70">
                    <HiOutlineClock className="h-3 w-3" /> {formatDate(event.at)} · {formatTime(event.at)}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        onConfirm={confirmReject}
        title="Reject this refund?"
        description="The passenger will be notified that their refund request was declined."
        confirmLabel="Reject refund"
        isDangerous
      />
    </div>
  )
}
