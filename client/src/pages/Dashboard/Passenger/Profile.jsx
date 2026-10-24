import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { HiOutlineUserCircle, HiOutlineCamera } from 'react-icons/hi'
import Card from '../../../components/common/Card'
import Button from '../../../components/common/Button'
import Checkbox from '../../../components/forms/Checkbox'
import FormField, { inputClasses } from '../../../components/forms/FormField'
import ConfirmDialog from '../../../components/common/ConfirmDialog'
import { useAuth } from '../../../hooks/useAuth'
import { useLogout } from '../../../hooks/useLogout'
import { useToast } from '../../../hooks/useToast'

export default function ProfilePage() {
  const { user } = useAuth()
  const logout = useLogout()
  const toast = useToast()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: '',
      emergencyName: '',
      emergencyPhone: '',
      notifyBooking: true,
      notifyPromotions: false,
    },
  })

  const onSubmit = async () => {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    setIsSaving(false)
    toast.success('Profile updated.')
  }

  const confirmDelete = () => {
    setIsDeleteOpen(false)
    toast.info('Account deletion requested.')
    logout()
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-fleet-black">Profile</h1>
      <p className="mt-1 text-sm text-fleet-gray">Manage your personal details and preferences.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-6" noValidate>
        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-fleet-yellow/15 text-fleet-yellow-dark">
              <HiOutlineUserCircle className="h-9 w-9" />
              <button
                type="button"
                aria-label="Change profile photo"
                className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-fleet-black text-fleet-white"
              >
                <HiOutlineCamera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              <p className="font-display font-semibold text-fleet-black">{user?.name}</p>
              <p className="text-sm text-fleet-gray">{user?.email}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <FormField label="Full name" htmlFor="name" error={errors.name?.message}>
              <input id="name" className={inputClasses(!!errors.name)} {...register('name', { required: 'Required' })} />
            </FormField>
            <FormField label="Email" htmlFor="email" error={errors.email?.message}>
              <input id="email" type="email" className={inputClasses(!!errors.email)} {...register('email', { required: 'Required' })} />
            </FormField>
            <FormField label="Phone number" htmlFor="phone">
              <input id="phone" placeholder="+254 7XX XXX XXX" className={inputClasses(false)} {...register('phone')} />
            </FormField>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <h2 className="font-display text-sm font-semibold text-fleet-black">Emergency contact</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <FormField label="Contact name" htmlFor="emergencyName">
              <input id="emergencyName" className={inputClasses(false)} {...register('emergencyName')} />
            </FormField>
            <FormField label="Contact phone" htmlFor="emergencyPhone">
              <input id="emergencyPhone" placeholder="+254 7XX XXX XXX" className={inputClasses(false)} {...register('emergencyPhone')} />
            </FormField>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <h2 className="font-display text-sm font-semibold text-fleet-black">Notification settings</h2>
          <div className="mt-4 flex flex-col gap-3">
            <Checkbox id="notifyBooking" label="Booking and trip updates" {...register('notifyBooking')} />
            <Checkbox id="notifyPromotions" label="Promotions and travel offers" {...register('notifyPromotions')} />
          </div>
        </Card>

        <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="font-display text-sm font-semibold text-fleet-black">Password</h2>
            <p className="mt-1 text-sm text-fleet-gray">Change your password via the reset flow.</p>
          </div>
          <Button as="a" href="/forgot-password" variant="outline" size="sm">
            Change password
          </Button>
        </Card>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsDeleteOpen(true)}
            className="text-sm font-medium text-state-error hover:underline"
          >
            Delete account
          </button>
          <Button type="submit" isLoading={isSaving}>
            Save changes
          </Button>
        </div>
      </form>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Delete your account?"
        description="This permanently removes your profile, saved travelers, and booking history. This can't be undone."
        confirmLabel="Delete account"
        isDangerous
      />
    </div>
  )
}
