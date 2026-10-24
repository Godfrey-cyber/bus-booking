import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import DataTable from '../../../components/dashboard/DataTable'
import Button from '../../../components/common/Button'
import Badge from '../../../components/common/Badge'
import Modal from '../../../components/common/Modal'
import ConfirmDialog from '../../../components/common/ConfirmDialog'
import FormField, { inputClasses } from '../../../components/forms/FormField'
import { OPERATOR_SCHEDULES, OPERATOR_ROUTES, OPERATOR_BUSES } from '../../../mock/operatorData'
import { formatDate, formatTime } from '../../../utils/format'
import { useToast } from '../../../hooks/useToast'

const STATUS_TONE = { scheduled: 'info', departed: 'success', cancelled: 'error' }

const routeLabel = (routeId) => {
  const r = OPERATOR_ROUTES.find((r) => r.id === routeId)
  return r ? `${r.origin} → ${r.destination}` : '—'
}
const busLabel = (busId) => OPERATOR_BUSES.find((b) => b.id === busId)?.plate ?? '—'

export default function OperatorSchedules() {
  const [schedules, setSchedules] = useState(OPERATOR_SCHEDULES)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const toast = useToast()

  const { register, handleSubmit, reset } = useForm({
    values: editing?.id
      ? { ...editing, departureTime: editing.departureTime?.slice(0, 16) }
      : { routeId: OPERATOR_ROUTES[0]?.id, busId: OPERATOR_BUSES[0]?.id, departureTime: '', status: 'scheduled' },
  })

  const openNew = () => {
    reset({ routeId: OPERATOR_ROUTES[0]?.id, busId: OPERATOR_BUSES[0]?.id, departureTime: '', status: 'scheduled' })
    setEditing({})
  }

  const onSubmit = (values) => {
    const parsed = { ...values, departureTime: new Date(values.departureTime).toISOString() }
    if (editing?.id) {
      setSchedules((prev) => prev.map((s) => (s.id === editing.id ? { ...s, ...parsed } : s)))
      toast.success('Schedule updated.')
    } else {
      setSchedules((prev) => [...prev, { id: `os${Date.now()}`, ...parsed }])
      toast.success('Schedule created.')
    }
    setEditing(null)
  }

  const confirmDelete = () => {
    setSchedules((prev) => prev.filter((s) => s.id !== deleteTarget.id))
    toast.success('Schedule removed.')
    setDeleteTarget(null)
  }

  const columns = [
    { key: 'route', label: 'Route', render: (row) => routeLabel(row.routeId) },
    { key: 'bus', label: 'Bus', render: (row) => busLabel(row.busId) },
    {
      key: 'departureTime',
      label: 'Departure',
      render: (row) => `${formatDate(row.departureTime)} · ${formatTime(row.departureTime)}`,
    },
    { key: 'status', label: 'Status', render: (row) => <Badge tone={STATUS_TONE[row.status]}>{row.status}</Badge> },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex gap-1">
          <button onClick={() => setEditing(row)} className="rounded-lg p-1.5 text-fleet-gray hover:bg-fleet-black/5 hover:text-fleet-black">
            <HiOutlinePencil className="h-4 w-4" />
          </button>
          <button onClick={() => setDeleteTarget(row)} className="rounded-lg p-1.5 text-fleet-gray hover:bg-state-error/10 hover:text-state-error">
            <HiOutlineTrash className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-fleet-black">Manage schedules</h1>
          <p className="mt-1 text-sm text-fleet-gray">Assign buses to routes and departure times.</p>
        </div>
        <Button leftIcon={<HiOutlinePlus className="h-4 w-4" />} onClick={openNew}>
          Add schedule
        </Button>
      </div>

      <div className="mt-6">
        <DataTable columns={columns} rows={schedules} emptyLabel="No schedules yet" />
      </div>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Edit schedule' : 'Add schedule'}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <FormField label="Route" htmlFor="routeId">
            <select id="routeId" className={inputClasses(false)} {...register('routeId')}>
              {OPERATOR_ROUTES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.origin} → {r.destination}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Bus" htmlFor="busId">
            <select id="busId" className={inputClasses(false)} {...register('busId')}>
              {OPERATOR_BUSES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.plate} — {b.model}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Departure" htmlFor="departureTime">
            <input id="departureTime" type="datetime-local" className={inputClasses(false)} {...register('departureTime', { required: true })} />
          </FormField>
          <FormField label="Status" htmlFor="status">
            <select id="status" className={inputClasses(false)} {...register('status')}>
              <option value="scheduled">Scheduled</option>
              <option value="departed">Departed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </FormField>
          <Button type="submit" className="mt-1 w-full">
            {editing?.id ? 'Save changes' : 'Add schedule'}
          </Button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Remove this schedule?"
        description="Passengers with active bookings on this departure should be notified separately."
        confirmLabel="Remove"
        isDangerous
      />
    </div>
  )
}
