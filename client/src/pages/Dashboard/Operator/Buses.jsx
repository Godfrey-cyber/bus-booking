// import { useState, useLocation, useEffect } from 'react'
// import { useForm } from 'react-hook-form'
// import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineCheckCircle, HiStar, HiOutlineBan } from 'react-icons/hi'
// import DataTable from '../../../components/dashboard/DataTable'
// import Button from '../../../components/common/Button'
// import Badge from '../../../components/common/Badge'
// import Modal from '../../../components/common/Modal'
// import ConfirmDialog from '../../../components/common/ConfirmDialog'
// import FormField, { inputClasses } from '../../../components/forms/FormField'
// import { OPERATOR_BUSES } from '../../../mock/operatorData'
// import { useToast } from '../../../hooks/useToast'
// import { useAuth } from '../../../hooks/useAuth'
// import { useSearchBusesQuery, useGetBusByIdQuery, useGetOperatorBusesQuery, useCreateBusMutation } from '../../../redux/services/busesApi'

// const STATUS_TONE = { active: 'success', maintenance: 'warning', retired: 'error' }
// const AVAILABLE_AMENITIES = ['Wi-fi', 'Charging Ports', 'Toilet', 'Tv', 'AC', 'Reclining Seats', 'Air Conditioning', 'Toilet']

// export default function OperatorBuses() {
//   const { user } = useAuth()
//   console.log("user", user)
//   // API Hooks
//   const [buses, setBuses] = useState(OPERATOR_BUSES)
//   const { data: operatorBuses, isLoading } = useGetOperatorBusesQuery(user.id)
//   const [createBus, { isLoading: isCreating }] = useCreateBusMutation()

//   const [editing, setEditing] = useState(null)
//   const [statusTarget, setStatusTarget] = useState(null) // { operator, nextStatus }
//   const [deleteTarget, setDeleteTarget] = useState(null)
//   const [selectedAmenities, setSelectedAmenities] = useState([])
//   const toast = useToast()

//   console.log("operatorBuses", operatorBuses)

//     const { register, handleSubmit, reset } = useForm({
//         values: editing?.id
//         ? {
//             plate_number: editing.plate_number || '',
//             model: editing.model || '',
//             capacity: editing.capacity || '',
//             status: editing.status || 'active',
//             } : {
//                 plate_number: '',
//                 model: '',
//                 capacity: '',
//                 status: 'active',
//             },
//     })

//     // Sync amenities array when opening modal
//     useEffect(() => {
//         if (editing?.amenities) {
//           const parsed = typeof editing.amenities === 'string' ? JSON.parse(editing.amenities) : editing.amenities
//           setSelectedAmenities(parsed || [])
//         } else {
//           setSelectedAmenities([])
//         }
//     }, [editing])

//     const openNew = () => {
//         reset({ plate_number: '', model: '', capacity: '', status: 'active' })
//         setSelectedAmenities(['Wi-fi', 'Charging Ports'])
//         setEditing({})
//     }

//     const toggleAmenity = (amenity) => {
//         setSelectedAmenities((prev) =>
//             prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
//         )
//     }

//     const onSubmit = async (values) => {
//         const payload = {
//             operator_id: user?.operator_id || user?.id || 16,
//             plate_number: values.plate_number,
//             model: values.model,
//             capacity: Number(values.capacity),
//             status: values.status,
//             amenities: selectedAmenities,
//         }

//         try {
//             if (editing?.id) {  // err
//                 // Handle update mutation here when ready
//                 toast.success('Bus updated successfully.')
//             } else {
//                 await createBus(payload).unwrap()
//                 toast.success('Bus added to your fleet.')
//             }
//             setEditing(null)
//         } catch (error) {
//             console.error('Failed to save bus:', error)
//             toast.error(error?.data?.message || 'Failed to save bus.')
//         }
//     }

//     // 4. API Status Update Handler
//     const confirmStatusChange = async () => {
//         if (!statusTarget) return

//         try {
//             await updateOperatorStatus({
//                 id: statusTarget.operator.id,
//                 status: statusTarget.nextStatus,
//             }).unwrap()

//             toast.success(`Bus status updated to ${statusTarget.nextStatus}.`)

//             setStatusTarget(null)

//         } catch (error) {
//             console.error('Failed to update operator status:', error)
//             toast.error(error?.data?.message || 'Failed to update status.')
//         }
//     }

//   // const onSubmit = (values) => {
//   //   if (editing?.id) {
//   //     setBuses((prev) => prev.map((b) => (b.id === editing.id ? { ...b, ...values, capacity: Number(values.capacity) } : b)))
//   //     toast.success('Bus updated.')
//   //   } else {
//   //     setBuses((prev) => [...prev, { id: `ob${Date.now()}`, amenities: [], ...values, capacity: Number(values.capacity) }])
//   //     toast.success('Bus added to your fleet.')
//   //   }
//   //   setEditing(null)
//   // }

//   const confirmDelete = () => {
//     setBuses((prev) => prev.filter((b) => b.id !== deleteTarget.id))
//     toast.success('Bus removed.')
//     setDeleteTarget(null)
//   }

//   const columns = [
//     { key: 'plate_number', label: 'Plate no.' },
//     { key: 'model', label: 'Model' },
//     { key: 'capacity', label: 'Capacity', render: (row) => `${row.capacity} seats` },
//     // { key: 'status', label: 'Status', render: (row) => <Badge tone={STATUS_TONE[row.status]}>{row.status}</Badge> },
//     // {
//     //   key: 'actions-2',
//     //   label: 'Action',
//     //   render: (row) =>
//     //     row.status === 'active' ? (
//     //       <Button
//     //         size="sm"
//     //         variant="outline"
//     //         leftIcon={<HiOutlineBan className="h-3.5 w-3.5" />}
//     //         onClick={() => setStatusTarget({ operator: row, nextStatus: 'maintenance' })}
//     //       >
//     //         Suspend
//     //       </Button>
//     //     ) : (
//     //       <Button
//     //         size="sm"
//     //         variant="outline"
//     //         leftIcon={<HiOutlineCheckCircle className="h-3.5 w-3.5" />}
//     //         onClick={() => setStatusTarget({ operator: row, nextStatus: 'active' })}
//     //       >
//     //         Reactivate
//     //       </Button>
//     //     ),
//     // },
//     { key: 'status', label: 'Status', render: (row) => <Badge tone={STATUS_TONE[row.status]}>{row.status}</Badge> },
//     {
//       key: 'actions-2',
//       label: 'Status Action',
//       render: (row) =>
//         row.status === 'active' ? (
//           <Button
//             size="sm"
//             variant="outline"
//             leftIcon={<HiOutlineBan className="h-3.5 w-3.5" />}
//             onClick={() => setStatusTarget({ operator: row, nextStatus: 'maintenance' })}
//           >
//             Maintain
//           </Button>
//         ) : (
//           <Button
//             size="sm"
//             variant="outline"
//             leftIcon={<HiOutlineCheckCircle className="h-3.5 w-3.5" />}
//             onClick={() => setStatusTarget({ operator: row, nextStatus: 'active' })}
//           >
//             Activate
//           </Button>
//         ),
//     },
//   ]

//   return (
//     <div>
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="font-display text-2xl font-bold text-fleet-black">Manage buses</h1>
//           <p className="mt-1 text-sm text-fleet-gray">Your registered fleet and their current status.</p>
//         </div>
//         <Button leftIcon={<HiOutlinePlus className="h-4 w-4" />} onClick={openNew}>
//           Add bus
//         </Button>
//       </div>

//       <div className="mt-6">
//         <DataTable columns={columns} rows={operatorBuses || []} isLoading={isLoading} emptyLabel="No buses registered yet" />
//       </div>

//       <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Edit bus' : 'Add bus'}>
//         <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
//           <FormField label="Model" htmlFor="model">
//             <input id="model" className={inputClasses(false)} {...register('model', { required: true })} />
//           </FormField>
//           <FormField label="Plate number" htmlFor="plate_number">
//             <input id="plate_number" className={inputClasses(false)} {...register('plate_number', { required: true })} />
//           </FormField>
//           <div className="grid grid-cols-2 gap-3">
//             <FormField label="Capacity" htmlFor="capacity">
//               <input id="capacity" type="number" min="1" className={inputClasses(false)} {...register('capacity', { required: true })} />
//             </FormField>
//             <FormField label="Status" htmlFor="status">
//               <select id="status" className={inputClasses(false)} {...register('status')}>
//                 <option value="active">Active</option>
//                 <option value="maintenance">Maintenance</option>
//                 <option value="retired">Retired</option>
//               </select>
//             </FormField>
//           </div>

//           <FormField label="Amenities">
//             <div className="grid grid-cols-2 gap-2 mt-1">
//               {AVAILABLE_AMENITIES.map((amenity) => (
//                 <label key={amenity} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={selectedAmenities.includes(amenity)}
//                     onChange={() => toggleAmenity(amenity)}
//                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                   />
//                   {amenity}
//                 </label>
//               ))}
//             </div>
//           </FormField>


//           <Button type="submit" className="mt-1 w-full">
//             {editing?.id ? 'Save changes' : 'Add bus'}
//           </Button>
//         </form>
//       </Modal>

//       <ConfirmDialog
//         isOpen={!!deleteTarget}
//         onClose={() => setDeleteTarget(null)}
//         onConfirm={confirmDelete}
//         title="Remove this bus?"
//         description={`${deleteTarget?.plate ?? 'This bus'} will be removed from your fleet and any active schedules.`}
//         confirmLabel="Remove"
//         isDangerous
//       />
//     </div>
//   )
// }


import { useState, useLocation, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineCheckCircle, HiStar, HiOutlineBan, HiX } from 'react-icons/hi'
import DataTable from '../../../components/dashboard/DataTable'
import Button from '../../../components/common/Button'
import Badge from '../../../components/common/Badge'
import Modal from '../../../components/common/Modal'
import ConfirmDialog from '../../../components/common/ConfirmDialog'
import FormField, { inputClasses } from '../../../components/forms/FormField'
import { OPERATOR_BUSES } from '../../../mock/operatorData'
import { useToast } from '../../../hooks/useToast'
import { useAuth } from '../../../hooks/useAuth'
import { useSearchBusesQuery, useGetBusByIdQuery, useGetOperatorBusesQuery, useCreateBusMutation } from '../../../redux/services/busesApi'

const STATUS_TONE = { active: 'success', maintenance: 'warning', retired: 'error' }
const AVAILABLE_AMENITIES = ['Wi-fi', 'Charging Ports', 'Toilet', 'Tv', 'AC', 'Reclining Seats']

export default function OperatorBuses() {
    const { user } = useAuth()
    console.log("user", user)
    // API Hooks
    const [buses, setBuses] = useState(OPERATOR_BUSES)
    const { data: operatorBuses, isLoading } = useGetOperatorBusesQuery(user?.id)
    const [createBus, { isLoading: isCreating }] = useCreateBusMutation()

    const [editing, setEditing] = useState(null)
    const [statusTarget, setStatusTarget] = useState(null) // { operator, nextStatus }
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [selectedAmenities, setSelectedAmenities] = useState([])
    const [customAmenityInput, setCustomAmenityInput] = useState('')
    const toast = useToast()

    console.log("operatorBuses", operatorBuses)

    const { register, handleSubmit, reset } = useForm({
        values: editing?.id
            ? {
                    plate_number: editing.plate_number || '',
                    model: editing.model || '',
                    capacity: editing.capacity || '',
                    status: editing.status || 'active',
                } : {
                    plate_number: '',
                    model: '',
                    capacity: '',
                    status: 'active',
                },
    })

    // Sync amenities array when opening modal
    useEffect(() => {
        if (editing?.amenities) {
            const parsed = typeof editing.amenities === 'string' ? JSON.parse(editing.amenities) : editing.amenities
            setSelectedAmenities(parsed || [])
        } else {
            setSelectedAmenities([])
        }
        setCustomAmenityInput('')
    }, [editing])

    const openNew = () => {
        reset({ plate_number: '', model: '', capacity: '', status: 'active' })
        setSelectedAmenities(['Wi-fi', 'Charging Ports'])
        setCustomAmenityInput('')
        setEditing({})
    }

    const toggleAmenity = (amenity) => {
        setSelectedAmenities((prev) =>
            prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
        )
    }

    const addCustomAmenity = (event) => {
        if (event) event.preventDefault()
        const trimmed = customAmenityInput.trim()
        if (trimmed && !selectedAmenities.some((a) => a.toLowerCase() === trimmed.toLowerCase())) {
            setSelectedAmenities((prev) => [...prev, trimmed])
            setCustomAmenityInput('')
        }
    }

    const removeAmenity = (amenityToRemove) => {
        setSelectedAmenities((prev) => prev.filter((item) => item !== amenityToRemove))
    }

    const onSubmit = async (values) => {
        const payload = {
            operator_id: user?.operator_id || user?.id || 16,
            plate_number: values.plate_number,
            model: values.model,
            capacity: Number(values.capacity),
            status: values.status,
            amenities: selectedAmenities,
        }

        try {
            if (editing?.id) {
                // Handle update mutation here when ready
                toast.success('Bus updated successfully.')
            } else {
                await createBus(payload).unwrap()
                toast.success('Bus added to your fleet.')
            }
            setEditing(null)
        } catch (error) {
            console.log(error)
            console.error('Failed to save bus:', error)
            toast.error(error?.data?.message || 'Failed to save bus.')
        }
    }

    // 4. API Status Update Handler
    const confirmStatusChange = async () => {
        if (!statusTarget) return

        try {
            await updateOperatorStatus({
                id: statusTarget.operator.id,
                status: statusTarget.nextStatus,
            }).unwrap()

            toast.success(`Bus status updated to ${statusTarget.nextStatus}.`)

            setStatusTarget(null)

        } catch (error) {
            console.error('Failed to update operator status:', error)
            toast.error(error?.data?.message || 'Failed to update status.')
        }
    }

    const confirmDelete = () => {
        setBuses((prev) => prev.filter((b) => b.id !== deleteTarget.id))
        toast.success('Bus removed.')
        setDeleteTarget(null)
    }

    const columns = [
        { key: 'plate_number', label: 'Plate no.' },
        { key: 'model', label: 'Model' },
        { key: 'capacity', label: 'Capacity', render: (row) => `${row.capacity} seats` },
        { key: 'status', label: 'Status', render: (row) => <Badge tone={STATUS_TONE[row.status]}>{row.status}</Badge> },
        {
        key: 'actions-2',
        label: 'Status Action',
        render: (row) =>
        row.status === 'active' ? (
            <Button
                size="sm"
                variant="outline"
                leftIcon={<HiOutlineBan className="h-3.5 w-3.5" />}
                onClick={() => setStatusTarget({ operator: row, nextStatus: 'maintenance' })}
              >
                Maintain
            </Button>
            ) : (
                <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<HiOutlineCheckCircle className="h-3.5 w-3.5" />}
                    onClick={() => setStatusTarget({ operator: row, nextStatus: 'active' })}
                >
                Activate
                </Button>
            ),
        },
    ]

    return (
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-fleet-black">Manage buses</h1>
              <p className="mt-1 text-sm text-fleet-gray">Your registered fleet and their current status.</p>
            </div>
            <Button leftIcon={<HiOutlinePlus className="h-4 w-4" />} onClick={openNew}>
              Add bus
            </Button>
          </div>

          <div className="mt-6">
            <DataTable columns={columns} rows={operatorBuses || []} isLoading={isLoading} emptyLabel="No buses registered yet" />
          </div>

          <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Edit bus' : 'Add bus'}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
              <FormField label="Model" htmlFor="model">
                <input id="model" className={inputClasses(false)} {...register('model', { required: true })} />
              </FormField>
              <FormField label="Plate number" htmlFor="plate_number">
                <input id="plate_number" className={inputClasses(false)} {...register('plate_number', { required: true })} />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Capacity" htmlFor="capacity">
                  <input id="capacity" type="number" min="1" className={inputClasses(false)} {...register('capacity', { required: true })} />
                </FormField>
                <FormField label="Status" htmlFor="status">
                  <select id="status" className={inputClasses(false)} {...register('status')}>
                    <option value="active">Active</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="retired">Retired</option>
                  </select>
                </FormField>
              </div>

              <FormField label="Amenities">
                <div className="flex flex-col gap-3 mt-1">
                  {/* Selected Amenities Badges */}
                  {selectedAmenities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedAmenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-200"
                        >
                          {amenity}
                          <button
                            type="button"
                            onClick={() => removeAmenity(amenity)}
                            className="hover:text-blue-900 focus:outline-none"
                          >
                            <HiX className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Custom Amenity Entry */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customAmenityInput}
                      onChange={(e) => setCustomAmenityInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addCustomAmenity(e)
                        }
                      }}
                      placeholder="Type custom amenity & press enter"
                      className={inputClasses(false)}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={addCustomAmenity}>
                      Add
                    </Button>
                  </div>

                  {/* Quick Presets */}
                  <div>
                    <p className="text-xs text-fleet-gray mb-1.5">Quick presets:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {AVAILABLE_AMENITIES.map((amenity) => (
                        <label key={amenity} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedAmenities.includes(amenity)}
                            onChange={() => toggleAmenity(amenity)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          {amenity}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </FormField>

              <Button type="submit" className="mt-1 w-full" disabled={isCreating}>
                {isCreating ? 'Saving...' : editing?.id ? 'Save changes' : 'Add bus'}
              </Button>
            </form>
          </Modal>

          <ConfirmDialog
            isOpen={!!deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={confirmDelete}
            title="Remove this bus?"
            description={`${deleteTarget?.plate_number ?? 'This bus'} will be removed from your fleet and any active schedules.`}
            confirmLabel="Remove"
            isDangerous
          />
        </div>
    )
}