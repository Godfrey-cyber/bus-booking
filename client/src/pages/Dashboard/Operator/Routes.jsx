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
import { useGetOperatorDestinationsQuery } from '../../../redux/services/destinationsApi'
import { useGetOperatorRoutesQuery, useCreateRouteMutation } from '../../../redux/services/routesApi'

export default function OperatorRoutes() {
  const { data: locationData, isLoading } = useGetOperatorDestinationsQuery()
  const { data: routesData, isRouteLoading } = useGetOperatorRoutesQuery()
  const [createRoute, { isLoading: isCreating }] = useCreateRouteMutation()

  const destinations = Array.isArray(locationData?.data) 
    ? locationData.data 
    : Array.isArray(locationData) 
    ? locationData 
    : []

    const routesOps = Array.isArray(routesData?.data) 
    ? routesData.data 
    : Array.isArray(routesData) 
    ? routesData 
    : []

    console.log("routesOps", routesOps)
    // console.log("routesOps", routesOps)
  const [routes, setRoutes] = useState(OPERATOR_ROUTES)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const toast = useToast()

  const { register, handleSubmit, reset } = useForm({
    values: editing?.id ? editing : { origin_id: '', destination_id: '', distance_km: '', duration_minutes: '', boarding_point: '', arrival_point: '', status: '' },
  })

  const openNew = () => {
    reset({ origin_id: '', destination_id: '', distance_km: '', duration_minutes: '', boarding_point: '', arrival_point: '', status: '' })
    setEditing({})
  }

  const onSubmit = async (values) => {
    const parsed = {
        origin_id: Number(values.origin_id),
        destination_id: Number(values.destination_id),
        distance_km: Number(values.distance_km),
        duration_minutes: Number(values.duration_minutes),
        boarding_point: values.boarding_point.trim(),
        arrival_point: values.arrival_point.trim(),
        status: values.status || 'active',
    }
    try {
        if (editing?.id) {
            setRoutes((prev) => prev.map((r) => (r.id === editing.id ? { ...r, ...parsed } : r)))
            toast.success('Route updated.')
        } else {
            // setRoutes((prev) => [...prev, { id: `or${Date.now()}`, ...parsed }])
            await createRoute(parsed).unwrap()
            toast.success('Route added.')
        }
        setEditing(null)
    } catch (error) {
        console.log(error)
        console.log(error.data.message)
        console.error('Failed to save route:', error)
        toast.error(error?.data?.message || 'Failed to save route.')
    }
  }

  const confirmDelete = () => {
    setRoutes((prev) => prev.filter((r) => r.id !== deleteTarget.id))
    toast.success('Route removed.')
    setDeleteTarget(null)
  }

  const columns = [
    { key: 'route', label: 'Route', render: (row) => `${row.origin_city} → ${row.location_city}` },
    { key: 'distance_km', label: 'Distance', render: (row) => `${row.distance_km} km` },
    { key: 'duration_minutes', label: 'Duration', render: (row) => `${Math.floor(row.duration_minutes / 60)}h ${row.duration_minutes % 60}m` },
    { key: 'base_price', label: 'Base fare', render: (row) => formatCurrency(row?.base_price || 0)},
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
        <DataTable columns={columns} rows={routesOps} emptyLabel="No routes yet" />
      </div>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Edit route' : 'Add route'}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
                <FormField label="Origin" htmlFor="origin_id">
                    <select id="origin_id" className={inputClasses(false)} {...register('origin_id')}>
                      <option value="">Unassigned</option>
                      {destinations?.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.city}
                        </option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Destination" htmlFor="destination_id">
                    <select id="destination_id" className={inputClasses(false)} {...register('destination_id')}>
                        <option value="">Unassigned</option>
                      {destinations?.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.city}
                        </option>
                      ))}
                    </select>
                </FormField>
            </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Boarding Point" htmlFor="boarding_point">
              <input id="boarding_point" placeholder="CBD Achives" className={inputClasses(false)} {...register('boarding_point', { required: true })} />
            </FormField>
            <FormField label="Arrival Point" htmlFor="arrival_point">
              <input id="arrival_point" placeholder="Naivas Nkurumah Street" className={inputClasses(false)} {...register('arrival_point', { required: true })} />
            </FormField>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Distance (km)" htmlFor="distance_km">
              <input id="distance_km" placeholder="300" type="number" className={inputClasses(false)} {...register('distance_km', { required: true })} />
            </FormField>
            <FormField label="Duration (min)" htmlFor="duration_minutes">
              <input id="duration_minutes" placeholder="360" type="number" className={inputClasses(false)} {...register('duration_minutes', { required: true })} />
            </FormField>
            <FormField label="Status" htmlFor="status">
                <select id="status" className={inputClasses(false)} {...register('status')}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
            </FormField>
          </div>
          <Button placeholder="" type="submit" className="mt-1 w-full">
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
