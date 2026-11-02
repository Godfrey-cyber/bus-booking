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
import { useGetOperatorDestinationsQuery } from '../../../redux/services/destinationsApi'
import { useGetOperatorBusesQuery } from '../../../redux/services/busesApi'
import { useGetOperatorRoutesQuery } from '../../../redux/services/routesApi'
import { useGetOperatorSchedulesQuery, useCreateScheduleMutation } from '../../../redux/services/schedulesApi'
import { selectCurrentUser } from '../../../redux/features/auth/authSlice'
import { useAuth } from '../../../hooks/useAuth'

const STATUS_TONE = { scheduled: 'info', departed: 'success', cancelled: 'error' }

export default function OperatorSchedules() {
    const { user } = useAuth()
    
    const [editing, setEditing] = useState(null)
    const { data: locationData, isLoading } = useGetOperatorDestinationsQuery()
    const { data: schedulesData, isScheduleLoading } = useGetOperatorSchedulesQuery()
    const [createSchedule, { isLoading: isCreating }] = useCreateScheduleMutation()
    const { data: routesData, isRoutesLoading } = useGetOperatorRoutesQuery()
    // const [schedules, setSchedules] = useState(schedulesData) // OperatorSchedules
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

    const routes = Array.isArray(routesData?.data) 
        ? routesData.data 
        : Array.isArray(routesData) 
        ? routesData 
        : []
    const { data: operatorBuses, isBusLoading } = useGetOperatorBusesQuery(user?.id)

    console.log("schedules", schedules)
    console.log("destinations", destinations)
    console.log("routes", routes)
    const [deleteTarget, setDeleteTarget] = useState(null)
    const toast = useToast()
    const busLabel = (busId) => {
        const b = schedules?.find((b) => b.bus_id === busId)
        return b ? b.plate_number : '—'
    }
  
    console.log("operatorBuses", operatorBuses)
    console.log("destinations", destinations)

    const routeLabel = (routeId) => {
        const r = routes.find((r) => r.route_id === routeId)
        return r ? `${r.origin_city} → ${r.location_city}` : '—'
    }

    const { register, handleSubmit, reset } = useForm({
        values: editing?.id
          ? { ...editing, departure_time: editing.departure_time?.slice(0, 16) }
          : { route_id: routes.route_id, bus_id: routes.bus_id, departure_time: '', departure_time: '', price: '', reccurence_type: '', status: 'scheduled' },
    })

    const openNew = () => {
        reset({ route_id: routes[0]?.id, bus_id: OPERATOR_BUSES[0]?.id, departure_time: '', arrival_time: '', price: '', reccurence_type: 'daily', bus: '', status: 'scheduled' })
        setEditing({})
    }

    const onSubmit = async (values) => {
        const parsed = {
            route_id: values.route_id,
            departure_time: values.departure_time ? `${values.departure_time}:00` : null,
            arrival_time: values.arrival_time ? `${values.arrival_time}:00` : null,
            bus_id: values.bus_id,
            price: values.price,
            reccurence_type: values.reccurence_type,
            status: values.status
        }


        if (editing?.id) {
            setSchedules((prev) => prev.map((s) => (s.id === editing.id ? { ...s, ...parsed } : s)))
            toast.success('Schedule updated.')
        } else {
            await createSchedule(parsed).unwrap()
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
        {   key: 'route', label: 'Route', render: (row) => routeLabel(row.route_id) },
        {   key: 'bus', label: 'Bus', render: (row) => busLabel(row.bus_id) },
        {
            key: 'departure_time',
            label: 'Departure',
            render: (row) => row.departure_time,
        },
        {   key: 'status', label: 'Status', render: (row) => <Badge tone={STATUS_TONE[row.status]}>{row.status}</Badge> },
        {   key: 'reccurence_type', label: 'Reccurence', render: (row) => <Badge tone={STATUS_TONE[row.reccurence_type]}>{row.reccurence_type}</Badge> },
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
    {/*→*/}
      <div className="mt-6">
        <DataTable columns={columns} rows={schedules} emptyLabel="No schedules yet" />
      </div>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Edit schedule' : 'Add schedule'}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <FormField label="Route" htmlFor="route_id">
              <select id="route_id" className={inputClasses(false)} {...register('route_id')}>
                <option value="">Select Route</option>
                {routes?.map((r) => (
                  <option key={r.route_id} value={r.route_id}>
                    {r.origin_city} — {r.location_city}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Price" htmlFor="price">
              <input id="price" type="number" placeholder="e.g. 2,000" className={inputClasses(false)} {...register('price', { required: true })} />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Departure" htmlFor="departure_time">
                <input id="departure_time" type="time" placeholder="08:00 AM" className={inputClasses(false)} {...register('departure_time', { required: true })} />
              </FormField>
              <FormField label="Arrival" htmlFor="arrival_time">
                <input id="arrival_time" type="time" placeholder="08:00 AM" className={inputClasses(false)} {...register('arrival_time', { required: true })} />
              </FormField>
            </div>
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
          <FormField label="Reccurence Type" htmlFor="reccurence_type">
            <select id="reccurence_type" className={inputClasses(false)} {...register('reccurence_type')}>
                <option value="">Select Reccurence Type</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
            </select>
          </FormField>
          <FormField label="Status" htmlFor="status">
            <select id="status" className={inputClasses(false)} {...register('status')}>
                <option value="">Select Status</option>
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
