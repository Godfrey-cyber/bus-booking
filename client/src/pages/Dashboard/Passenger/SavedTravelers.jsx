import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineUserGroup } from 'react-icons/hi'
import Card from '../../../components/common/Card'
import Button from '../../../components/common/Button'
import Modal from '../../../components/common/Modal'
import ConfirmDialog from '../../../components/common/ConfirmDialog'
import FormField, { inputClasses } from '../../../components/forms/FormField'
import EmptyState from '../../../components/common/EmptyState'
import { useToast } from '../../../hooks/useToast'

const INITIAL_TRAVELERS = [
  { id: 't1', name: 'Amina Wafula', age: 29, gender: 'Female' },
  { id: 't2', name: 'Brian Wafula', age: 6, gender: 'Male' },
]

export default function SavedTravelersPage() {
  const [travelers, setTravelers] = useState(INITIAL_TRAVELERS)
  const [editing, setEditing] = useState(null) // traveler being edited, or {} for new
  const [deleteTarget, setDeleteTarget] = useState(null)
  const toast = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ values: editing?.id ? editing : { name: '', age: '', gender: 'Female' } })

  const openNew = () => {
    reset({ name: '', age: '', gender: 'Female' })
    setEditing({})
  }

  const onSubmit = (values) => {
    if (editing?.id) {
      setTravelers((prev) => prev.map((t) => (t.id === editing.id ? { ...t, ...values, age: Number(values.age) } : t)))
      toast.success('Traveler updated.')
    } else {
      setTravelers((prev) => [...prev, { id: `t${Date.now()}`, ...values, age: Number(values.age) }])
      toast.success('Traveler saved.')
    }
    setEditing(null)
  }

  const confirmDelete = () => {
    setTravelers((prev) => prev.filter((t) => t.id !== deleteTarget.id))
    toast.success('Traveler removed.')
    setDeleteTarget(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-fleet-black">Saved travelers</h1>
          <p className="mt-1 text-sm text-fleet-gray">Reuse these details when booking for family or friends.</p>
        </div>
        <Button leftIcon={<HiOutlinePlus className="h-4 w-4" />} onClick={openNew}>
          Add traveler
        </Button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {travelers.length === 0 && (
          <EmptyState
            icon={<HiOutlineUserGroup />}
            title="No saved travelers"
            description="Add people you frequently book tickets for."
            actionLabel="Add traveler"
            onAction={openNew}
          />
        )}
        {travelers.map((t) => (
          <Card key={t.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-fleet-black">{t.name}</p>
              <p className="text-sm text-fleet-gray">
                {t.age} yrs · {t.gender}
              </p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setEditing(t)}
                aria-label={`Edit ${t.name}`}
                className="rounded-lg p-2 text-fleet-gray hover:bg-fleet-black/5 hover:text-fleet-black"
              >
                <HiOutlinePencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDeleteTarget(t)}
                aria-label={`Remove ${t.name}`}
                className="rounded-lg p-2 text-fleet-gray hover:bg-state-error/10 hover:text-state-error"
              >
                <HiOutlineTrash className="h-4 w-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Edit traveler' : 'Add traveler'}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <FormField label="Full name" htmlFor="t-name" error={errors.name?.message}>
            <input id="t-name" className={inputClasses(!!errors.name)} {...register('name', { required: 'Name is required' })} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Age" htmlFor="t-age" error={errors.age?.message}>
              <input
                id="t-age"
                type="number"
                min="0"
                className={inputClasses(!!errors.age)}
                {...register('age', { required: 'Required', min: { value: 0, message: 'Invalid age' } })}
              />
            </FormField>
            <FormField label="Gender" htmlFor="t-gender">
              <select id="t-gender" className={inputClasses(false)} {...register('gender')}>
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
            </FormField>
          </div>
          <Button type="submit" className="mt-1 w-full">
            {editing?.id ? 'Save changes' : 'Add traveler'}
          </Button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Remove this traveler?"
        description={`${deleteTarget?.name ?? 'This traveler'} will be removed from your saved list.`}
        confirmLabel="Remove"
        isDangerous
      />
    </div>
  )
}
