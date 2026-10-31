import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import DataTable from '../../../components/dashboard/DataTable'
import Button from '../../../components/common/Button'
import Badge from '../../../components/common/Badge'
import Modal from '../../../components/common/Modal'
import ConfirmDialog from '../../../components/common/ConfirmDialog'
import FormField, { inputClasses } from '../../../components/forms/FormField'
import { OPERATOR_DESTINATIONS } from '../../../mock/operatorData'
import { useToast } from '../../../hooks/useToast'
import { useGetOperatorDestinationsQuery, useCreateDestinationMutation } from '../../../redux/services/destinationsApi'
import { selectCurrentUser } from '../../../redux/features/auth/authSlice'
 

const STATUS_TONE = { active: 'success', maintenance: 'warning', retired: 'error' }

export default function OperatorBuses() {
  // const [destinations, setDestinations] = useState(OPERATOR_DESTINATIONS)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const toast = useToast()

  // 1. Pull user/operator_id from Redux Auth state
  const currentUser = useSelector(selectCurrentUser)
  const operatorId = currentUser?.operator_id || currentUser?.id

  // 2. Fetch destinations from API
  const { data: locationData, isLoading } = useGetOperatorDestinationsQuery()
  const destinations = Array.isArray(locationData?.data) 
    ? locationData.data 
    : Array.isArray(locationData) 
    ? locationData 
    : []
    console.log("destinations", destinations)
    // 3. RTK Query Mutation Hook
  const [createDestination, { isLoading: isCreating }] = useCreateDestinationMutation()

  const { register, handleSubmit, reset } = useForm({
    values: editing?.id ? editing : { city: '', country: '', latitude: '', longitude: '' },
  })

  const openNew = () => {
    reset({ city: '', country: '', latitude: '', longitude: '' })
    setEditing({})
  }

  // 4. Submit handler using backend API
  const onSubmit = async (values) => {
    try {
      const payload = {
        city: values.city,
        country: values.country,
        latitude: Number(values.latitude),
        longitude: Number(values.longitude),
        // image: values.image,
        // operator_id: operatorId, // Included automatically from auth user
      }

      if (editing?.id) {
        // Handle update mutation here when implemented
        toast.success('Destination updated.')
      } else {
        await createDestination(payload).unwrap()
        toast.success('Destination added successfully.')
      }

      setEditing(null)
      reset()
    } catch (error) {
      console.error('Failed to save destination:', error)
      toast.error(error?.data?.message || 'Failed to save destination.')
    }
  }

  const confirmDelete = () => {
    // Delete logic goes here when endpoint is ready
    toast.success('Destination removed.')
    setDeleteTarget(null)
  }

  const columns = [
    { key: 'city', label: 'City' },
    { key: 'country', label: 'Country' },
    { key: 'latitude', label: 'Latitude', render: (row) => `${row.latitude} ` },
    { key: 'longitude', label: 'Longitude', render: (row) => `${row.longitude} ` },
    {
      key: 'image',
      label: 'Image',
      render: (row) => row.image ? (
        <img src={row.image} alt={row.city} className="h-8 w-12 rounded object-cover" />
      ) : (
        <span className="text-xs text-fleet-gray">No image</span>
      )
    },
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
          <h1 className="font-display text-2xl font-bold text-fleet-black">Manage destinations</h1>
          <p className="mt-1 text-sm text-fleet-gray">Your registered fleet and their current status.</p>
        </div>
        <Button leftIcon={<HiOutlinePlus className="h-4 w-4" />} onClick={openNew}>
          Add Destination
        </Button>
      </div>

      <div className="mt-6">
        <DataTable 
          columns={columns} 
          rows={destinations} 
          isLoading={isLoading} 
          emptyLabel="No destinations registered yet" 
        />
      </div>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Edit destinations' : 'Add destinations'}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <FormField label="City" htmlFor="city">
            <input id="city" className={inputClasses(false)} {...register('city', { required: true })} />
          </FormField>
          <FormField label="Country" htmlFor="country">
            <input id="country" className={inputClasses(false)} {...register('country', { required: true })} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Latitude" htmlFor="latitude">
              <input id="latitude" type="number" min="1" className={inputClasses(false)} {...register('latitude', { required: true })} />
            </FormField>
            <FormField label="Longitude" htmlFor="longitude">
              <input id="longitude" type="number" min="1" className={inputClasses(false)} {...register('longitude', { required: true })} />
            </FormField>
          </div>
          {/*<FormField label="Image" htmlFor="image">
                <input id="image" className={inputClasses(false)} {...register('image', { required: true })} />
          </FormField>*/}
          <Button type="submit" className="mt-1 w-full">
            {editing?.id ? 'Save changes' : 'Add destination	'}
          </Button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Remove this destination	?"
        description={`${deleteTarget?.plate ?? 'This destination'} will be removed from your fleet and any active schedules.`}
        confirmLabel="Remove"
        isDangerous
      />
    </div>
  )
}
