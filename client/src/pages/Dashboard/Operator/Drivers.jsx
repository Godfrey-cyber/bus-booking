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
import { useAuth } from '../../../hooks/useAuth'
import { useSearchDriversQuery, useGetOperatorDriversQuery, useCreateDriverMutation } from '../../../redux/services/driversApi'
import { useGetOperatorBusesQuery } from '../../../redux/services/busesApi'

export default function OperatorDrivers() {
    const { user } = useAuth()
    // const { data: driversData, isLoading } = useSearchDriversQuery();
    const { data: operatorDrivers, isLoading } = useGetOperatorDriversQuery(user?.id)
    const [createDriver, { isLoading: isCreating }] = useCreateDriverMutation()
    const { data: operatorBuses, loading } = useGetOperatorBusesQuery(user?.id)
    const [drivers, setDrivers] = useState([])
    const [editing, setEditing] = useState(null)
    const [deleteTarget, setDeleteTarget] = useState(null)
    const toast = useToast()

    console.log("operatorDrivers", operatorDrivers);
    console.log("drivers", drivers);
    const busLabel = (busId) => operatorBuses?.find((b) => b.id === busId)?.plate_number ?? 'Unassigned'

  const { register, handleSubmit, reset } = useForm({
    values: editing?.id ? editing : { name: '', license_number: '', phone: '', bus_id: '' },
  })

  const openNew = () => {
    reset({ name: '', license_number: '', phone: '', bus_id: '' })
    setEditing({})
  }

  // const onSubmit = (values) => {
  //   if (editing?.id) {
  //     setDrivers((prev) => prev.map((d) => (d.id === editing.id ? { ...d, ...values } : d)))
  //     toast.success('Driver updated.')
  //   } else {
  //     setDrivers((prev) => [...prev, { id: `od${Date.now()}`, ...values }])
  //     toast.success('Driver added.')
  //   }
  //   setEditing(null)
  // }

  const onSubmit = async (values) => {
        const payload = {
            name: values.name,
            license_number: values.license_number,
            phone: values.phone,
            bus_id: values.bus_id
        }

        try {
            if (editing?.id) {
                // Handle update mutation here when ready
                toast.success('Driver updated successfully.')
            } else {
                await createDriver(payload).unwrap()
                toast.success('Driver added to your fleet.')
            }
            setEditing(null)
        } catch (error) {
            console.log(error)
            console.error('Failed to save bus:', error)
            toast.error(error?.data?.message || 'Failed to save bus.')
        }
    }

  const confirmDelete = () => {
    setDrivers((prev) => prev.filter((d) => d.id !== deleteTarget.id))
    toast.success('Driver removed.')
    setDeleteTarget(null)
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'license_number', label: 'License no.' },
    { key: 'phone', label: 'Phone' },
    { key: 'status', label: 'Status' },
    { key: 'plate_number', label: 'Assigned bus', render: (row) => busLabel(row.bus_id) },
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
        <DataTable columns={columns} rows={operatorDrivers} emptyLabel="No drivers yet" />
      </div>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Edit driver' : 'Add driver'}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <FormField label="Full name" htmlFor="name">
            <input id="name" className={inputClasses(false)} {...register('name', { required: true })} />
          </FormField>
          <FormField label="License number" htmlFor="license_number">
            <input id="license_number" className={inputClasses(false)} {...register('license_number', { required: true })} />
          </FormField>
          <FormField label="Phone" htmlFor="phone">
            <input id="phone" className={inputClasses(false)} {...register('phone', { required: true })} />
          </FormField>
          <FormField label="Assigned bus" htmlFor="bus_id">
            <select id="bus_id" className={inputClasses(false)} {...register('bus_id')}>
              <option value="">Unassigned</option>
              {operatorBuses?.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.plate_number} — {b.model} — {b.name}
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
