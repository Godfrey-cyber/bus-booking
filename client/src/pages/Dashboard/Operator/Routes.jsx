import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import DataTable from '../../../components/dashboard/DataTable'
import Button from '../../../components/common/Button'
import Modal from '../../../components/common/Modal'
import ConfirmDialog from '../../../components/common/ConfirmDialog'
import FormField, { inputClasses } from '../../../components/forms/FormField'
import { OPERATOR_ROUTES } from '../../../mock/operatorData'
import { formatCurrency } from '../../../utils/format'
import { useToast } from '../../../hooks/useToast'

export default function OperatorRoutes() {
  const [routes, setRoutes] = useState(OPERATOR_ROUTES)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const toast = useToast()

  const { register, handleSubmit, reset } = useForm({
    values: editing?.id ? editing : { origin: '', destination: '', distanceKm: '', durationMin: '', basePrice: '' },
  })

  const openNew = () => {
    reset({ origin: '', destination: '', distanceKm: '', durationMin: '', basePrice: '' })
    setEditing({})
  }

  const onSubmit = (values) => {
    const parsed = {
      ...values,
      distanceKm: Number(values.distanceKm),
      durationMin: Number(values.durationMin),
      basePrice: Number(values.basePrice),
    }
    if (editing?.id) {
      setRoutes((prev) => prev.map((r) => (r.id === editing.id ? { ...r, ...parsed } : r)))
      toast.success('Route updated.')
    } else {
      setRoutes((prev) => [...prev, { id: `or${Date.now()}`, ...parsed }])
      toast.success('Route added.')
    }
    setEditing(null)
  }

  const confirmDelete = () => {
    setRoutes((prev) => prev.filter((r) => r.id !== deleteTarget.id))
    toast.success('Route removed.')
    setDeleteTarget(null)
  }

  const columns = [
    { key: 'route', label: 'Route', render: (row) => `${row.origin} → ${row.destination}` },
    { key: 'distanceKm', label: 'Distance', render: (row) => `${row.distanceKm} km` },
    { key: 'durationMin', label: 'Duration', render: (row) => `${Math.floor(row.durationMin / 60)}h ${row.durationMin % 60}m` },
    { key: 'basePrice', label: 'Base fare', render: (row) => formatCurrency(row.basePrice) },
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
          <h1 className="font-display text-2xl font-bold text-fleet-black">Manage routes</h1>
          <p className="mt-1 text-sm text-fleet-gray">Routes you operate and their base fares.</p>
        </div>
        <Button leftIcon={<HiOutlinePlus className="h-4 w-4" />} onClick={openNew}>
          Add route
        </Button>
      </div>

      <div className="mt-6">
        <DataTable columns={columns} rows={routes} emptyLabel="No routes yet" />
      </div>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Edit route' : 'Add route'}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Origin" htmlFor="origin">
              <input id="origin" className={inputClasses(false)} {...register('origin', { required: true })} />
            </FormField>
            <FormField label="Destination" htmlFor="destination">
              <input id="destination" className={inputClasses(false)} {...register('destination', { required: true })} />
            </FormField>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Distance (km)" htmlFor="distanceKm">
              <input id="distanceKm" type="number" className={inputClasses(false)} {...register('distanceKm', { required: true })} />
            </FormField>
            <FormField label="Duration (min)" htmlFor="durationMin">
              <input id="durationMin" type="number" className={inputClasses(false)} {...register('durationMin', { required: true })} />
            </FormField>
            <FormField label="Base fare" htmlFor="basePrice">
              <input id="basePrice" type="number" className={inputClasses(false)} {...register('basePrice', { required: true })} />
            </FormField>
          </div>
          <Button type="submit" className="mt-1 w-full">
            {editing?.id ? 'Save changes' : 'Add route'}
          </Button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Remove this route?"
        description="Any schedules built on this route will need to be reassigned."
        confirmLabel="Remove"
        isDangerous
      />
    </div>
  )
}
