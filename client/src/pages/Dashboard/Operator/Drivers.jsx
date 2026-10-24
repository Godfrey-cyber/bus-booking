import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import DataTable from '../../../components/dashboard/DataTable'
import Button from '../../../components/common/Button'
import Modal from '../../../components/common/Modal'
import ConfirmDialog from '../../../components/common/ConfirmDialog'
import FormField, { inputClasses } from '../../../components/forms/FormField'
import { OPERATOR_DRIVERS, OPERATOR_BUSES } from '../../../mock/operatorData'
import { useToast } from '../../../hooks/useToast'
import { useSearchDriversQuery } from '../../../redux/services/driversApi'
// 

const busLabel = (busId) => OPERATOR_BUSES.find((b) => b.id === busId)?.plate ?? 'Unassigned'

export default function OperatorDrivers() {
    const { data: driversData, isLoading } = useSearchDriversQuery();
    const [drivers, setDrivers] = useState(OPERATOR_DRIVERS)
    const [editing, setEditing] = useState(null)
    const [deleteTarget, setDeleteTarget] = useState(null)
    const toast = useToast()

    console.log("driversData", driversData);

  const { register, handleSubmit, reset } = useForm({
    values: editing?.id ? editing : { name: '', license: '', phone: '' },
  })

  const openNew = () => {
    reset({ name: '', license: '', phone: '' })
    setEditing({})
  }

  const onSubmit = (values) => {
    if (editing?.id) {
      setDrivers((prev) => prev.map((d) => (d.id === editing.id ? { ...d, ...values } : d)))
      toast.success('Driver updated.')
    } else {
      setDrivers((prev) => [...prev, { id: `od${Date.now()}`, ...values }])
      toast.success('Driver added.')
    }
    setEditing(null)
  }

  const confirmDelete = () => {
    setDrivers((prev) => prev.filter((d) => d.id !== deleteTarget.id))
    toast.success('Driver removed.')
    setDeleteTarget(null)
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'license', label: 'License no.' },
    { key: 'phone', label: 'Phone' },
    { key: 'bus', label: 'Assigned bus', render: (row) => busLabel(row.assignedBusId) },
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
          <h1 className="font-display text-2xl font-bold text-fleet-black">Manage drivers</h1>
          <p className="mt-1 text-sm text-fleet-gray">Driver roster and bus assignments.</p>
        </div>
        <Button leftIcon={<HiOutlinePlus className="h-4 w-4" />} onClick={openNew}>
          Add driver
        </Button>
      </div>

      <div className="mt-6">
        <DataTable columns={columns} rows={drivers} emptyLabel="No drivers yet" />
      </div>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Edit driver' : 'Add driver'}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <FormField label="Full name" htmlFor="name">
            <input id="name" className={inputClasses(false)} {...register('name', { required: true })} />
          </FormField>
          <FormField label="License number" htmlFor="license">
            <input id="license" className={inputClasses(false)} {...register('license', { required: true })} />
          </FormField>
          <FormField label="Phone" htmlFor="phone">
            <input id="phone" className={inputClasses(false)} {...register('phone', { required: true })} />
          </FormField>
          <FormField label="Assigned bus" htmlFor="assignedBusId">
            <select id="assignedBusId" className={inputClasses(false)} {...register('assignedBusId')}>
              <option value="">Unassigned</option>
              {OPERATOR_BUSES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.plate} — {b.model}
                </option>
              ))}
            </select>
          </FormField>
          <Button type="submit" className="mt-1 w-full">
            {editing?.id ? 'Save changes' : 'Add driver'}
          </Button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Remove this driver?"
        description={`${deleteTarget?.name ?? 'This driver'} will be removed from your roster.`}
        confirmLabel="Remove"
        isDangerous
      />
    </div>
  )
}
