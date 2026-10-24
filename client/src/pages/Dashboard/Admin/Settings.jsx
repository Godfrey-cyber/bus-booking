import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Card from '../../../components/common/Card'
import Button from '../../../components/common/Button'
import Checkbox from '../../../components/forms/Checkbox'
import FormField, { inputClasses } from '../../../components/forms/FormField'
import { useToast } from '../../../hooks/useToast'

export default function AdminSettings() {
  const [isSaving, setIsSaving] = useState(false)
  const toast = useToast()
  const { register, handleSubmit } = useForm({
    defaultValues: {
      platformName: 'FleetGo',
      supportEmail: 'support@fleetgo.co.ke',
      commissionRate: 8,
      seatHoldMinutes: 10,
      cancellationFeePercent: 10,
      allowGuestCheckout: false,
      requireEmailVerification: true,
      maintenanceMode: false,
    },
  })

  const onSubmit = async () => {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    setIsSaving(false)
    toast.success('Settings saved.')
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-fleet-black">System settings</h1>
      <p className="mt-1 text-sm text-fleet-gray">Platform-wide configuration for booking rules and branding.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-6" noValidate>
        <Card className="p-5 sm:p-6">
          <h2 className="font-display text-sm font-semibold text-fleet-black">Branding</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <FormField label="Platform name" htmlFor="platformName">
              <input id="platformName" className={inputClasses(false)} {...register('platformName')} />
            </FormField>
            <FormField label="Support email" htmlFor="supportEmail">
              <input id="supportEmail" type="email" className={inputClasses(false)} {...register('supportEmail')} />
            </FormField>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <h2 className="font-display text-sm font-semibold text-fleet-black">Booking rules</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <FormField label="Commission rate (%)" htmlFor="commissionRate">
              <input id="commissionRate" type="number" min="0" max="100" className={inputClasses(false)} {...register('commissionRate')} />
            </FormField>
            <FormField label="Seat hold (minutes)" htmlFor="seatHoldMinutes">
              <input id="seatHoldMinutes" type="number" min="1" className={inputClasses(false)} {...register('seatHoldMinutes')} />
            </FormField>
            <FormField label="Cancellation fee (%)" htmlFor="cancellationFeePercent">
              <input id="cancellationFeePercent" type="number" min="0" max="100" className={inputClasses(false)} {...register('cancellationFeePercent')} />
            </FormField>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <h2 className="font-display text-sm font-semibold text-fleet-black">Access & availability</h2>
          <div className="mt-4 flex flex-col gap-3">
            <Checkbox id="allowGuestCheckout" label="Allow guest checkout without an account" {...register('allowGuestCheckout')} />
            <Checkbox id="requireEmailVerification" label="Require email verification before booking" {...register('requireEmailVerification')} />
            <Checkbox id="maintenanceMode" label="Maintenance mode (disables new bookings platform-wide)" {...register('maintenanceMode')} />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" isLoading={isSaving}>
            Save settings
          </Button>
        </div>
      </form>
    </div>
  )
}
