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
import { useSearchDriversQuery, useGetOperatorDriversQuery } from '../../../redux/services/driversApi'
import { useGetOperatorBusesQuery } from '../../../redux/services/busesApi'
import { useGetOperatorSchedulesQuery } from '../../../redux/services/schedulesApi'
import { useGetTripByIdQuery, useCreateTripMutation, useGetOperatorTripsQuery } from '../../../redux/services/tripsApi'
import { selectCurrentUser } from '../../../redux/features/auth/authSlice'
import { useAuth } from '../../../hooks/useAuth'
// 
export default function OperatorTrips() {
  const { user } = useAuth()
  const { data: locationData, isLoading } = useGetOperatorDestinationsQuery()
  const { data: routesData, isRouteLoading } = useGetOperatorRoutesQuery()
  const { data: operatorDrivers, isOpLoading } = useGetOperatorDriversQuery(user?.id)
  const [createTrip, { isLoading: isCreating }] = useCreateTripMutation()
  const { data: schedulesData, isScheduleLoading } = useGetOperatorSchedulesQuery()
  const { data: operatorBuses, isBusLoading } = useGetOperatorBusesQuery(user?.id)
  const { data: operatoTrips, isTripsLoading } = useGetOperatorTripsQuery()

  const destinations = Array.isArray(locationData?.data) 
    ? locationData.data 
    : Array.isArray(locationData) 
    ? locationData 
    : []

    const schedules = Array.isArray(schedulesData?.data) 
        ? schedulesData.data 
        : Array.isArray(schedulesData) 
        ? schedulesData 
        : []

    const trips = Array.isArray(operatoTrips?.data) 
    ? operatoTrips.data 
    : Array.isArray(operatoTrips) 
    ? operatoTrips 
    : []

  const priceLabel = (tripId) => trips?.find((b) => b.id === tripId)?.price ?? '-'
  console.log("schedules", schedules)
  console.log("operatorDrivers", operatorDrivers)
  console.log("operatorBuses", operatorBuses)

  const [routes, setRoutes] = useState(OPERATOR_ROUTES)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const toast = useToast()

  const { register, handleSubmit, reset } = useForm({
    values: editing?.id ? editing : { schedule_id: '', bus_id: '', driver_id: '', trip_date: '', departure_time: '', arrival_time: '', price: '', status: '' },
  })

  const openNew = () => {
    reset({ schedule_id: '', bus_id: '', driver_id: '', trip_date: '', departure_time: '', arrival_time: '', price: '', status: '' })
    setEditing({})
  }

  const onSubmit = async (values) => {
    const parsed = {
        schedule_id: Number(values.schedule_id),
        bus_id: Number(values.bus_id),
        driver_id: Number(values.driver_id),
        trip_date: values.trip_date, 
        departure_time: values.departure_time ? `${values.departure_time}:00` : null,
        arrival_time: values.arrival_time ? `${values.arrival_time}:00` : null,
        price: Number(values.price),
        status: values.status || 'scheduled',
    }
    try {
        if (editing?.id) {
            setRoutes((prev) => prev.map((r) => (r.id === editing.id ? { ...r, ...parsed } : r)))
            toast.success('Trip updated.')
        } else {
            // setRoutes((prev) => [...prev, { id: `or${Date.now()}`, ...parsed }])
            await createTrip(parsed).unwrap()
            toast.success('Trip added.')
        }
        setEditing(null)
    } catch (error) {
        console.log(error)
        // console.log(error.data.message)
        console.error('Failed to save trip:', error)
        toast.error(error?.data?.message || 'Failed to save trip.')
    }
  }

  const confirmDelete = () => {
    setRoutes((prev) => prev.filter((r) => r.id !== deleteTarget.id))
    toast.success('Trip removed.')
    setDeleteTarget(null)
  }

  const columns = [
    { key: 'trip', label: 'Trip', render: (row) => `${row.origin_city} → ${row.location_city}` },
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
          <h1 className="font-display text-2xl font-bold text-fleet-black">Manage trips</h1>
          <p className="mt-1 text-sm text-fleet-gray">Trips you operate and their base fares.</p>
        </div>
        <Button leftIcon={<HiOutlinePlus className="h-4 w-4" />} onClick={openNew}>
          Add trip
        </Button>
      </div>

      <div className="mt-6">
        <DataTable columns={columns} rows={trips} emptyLabel="No trips yet" />
      </div>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Edit trip' : 'Add trip'}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
    		<FormField label="Schedule" htmlFor="schedule_id">
	            <select id="schedule_id" className={inputClasses(false)} {...register('schedule_id')}>
	              <option value="">Select Schedule</option>
	              {schedules?.map((s) => (
	                <option key={s.id} value={s.id}>
	                  {s.id} — {s.reccurence_type}
	                </option>
	              ))}
	            </select>
	        </FormField>
          	<div className="grid grid-cols-2 gap-3">
                <FormField label="Bus" htmlFor="bus_id">
		            <select id="bus_id" className={inputClasses(false)} {...register('bus_id')}>
		              <option value="">Select Bus</option>
		              {operatorBuses?.map((b) => (
		                <option key={b.id} value={b.id}>
		                  {b.plate_number} — {b.model}
		                </option>
		              ))}
		            </select>
		        </FormField>
                <FormField label="Assigned bus" htmlFor="driver_id">
		            <select id="driver_id" className={inputClasses(false)} {...register('driver_id')}>
		              <option value="">Unassigned</option>
		              {operatorDrivers?.map((d) => (
		                <option key={d.id} value={d.id}>
		                  {d.name} — {d.license_number}
		                </option>
		              ))}
		            </select>
          		</FormField>
            </div>
            <FormField label="Trip Date" htmlFor="trip_date">
                <input id="trip_date" type="date" placeholder="08:00 AM" className={inputClasses(false)} {...register('trip_date', { required: true })} />
              </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Departure Time" htmlFor="departure_time">
                <input id="departure_time" type="time" placeholder="08:00 AM" className={inputClasses(false)} {...register('departure_time', { required: true })} />
              </FormField>
              <FormField label="Arrival Time" htmlFor="arrival_time">
                <input id="arrival_time" type="time" placeholder="08:00 AM" className={inputClasses(false)} {...register('arrival_time', { required: true })} />
              </FormField>
            </div>
            <FormField label="Price" htmlFor="price">
              <input id="price" type="number" placeholder="e.g. 2,000" className={inputClasses(false)} {...register('price', { required: true })} />
            </FormField>
          {/*<div className="grid grid-cols-3 gap-3">*/}
            <FormField label="Status" htmlFor="status">
	            <select id="status" className={inputClasses(false)} {...register('status')}>
	                <option value="">Select Status</option>
	                <option value="scheduled">Scheduled</option>
	                <option value="departed">Departed</option>
	                <option value="completed">Completed</option>
	                <option value="cancelled">Cancelled</option>
	            </select>
          	</FormField>
          {/*</div>*/}
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
