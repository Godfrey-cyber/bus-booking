import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { HiOutlineCheckCircle } from 'react-icons/hi'
import Button from '../../components/common/Button'
import FormField from '../../components/forms/FormField'
import PasswordInput from '../../components/forms/PasswordInput'
import { resetPasswordSchema } from '../../utils/validation'
import { useResetPasswordMutation } from '../../redux/services/authApi'

export default function ResetPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) })
  const [resetPassword, { isLoading }] = useResetPasswordMutation()
  const [done, setDone] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (values) => {
    const result = await resetPassword(values)
    if (!result.error) setDone(true)
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-state-success/10 text-state-success">
          <HiOutlineCheckCircle className="h-6 w-6" />
        </div>
        <h1 className="mt-4 font-display text-xl font-bold text-fleet-black">Password updated</h1>
        <p className="mt-1.5 text-sm text-fleet-gray">You can now log in with your new password.</p>
        <Button className="mt-6" onClick={() => navigate('/login')}>
          Go to log in
        </Button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-fleet-black">Set a new password</h1>
      <p className="mt-1.5 text-sm text-fleet-gray">Choose a strong password you haven't used before.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4" noValidate>
        <FormField label="New password" htmlFor="password" error={errors.password?.message}>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            hasError={!!errors.password}
            {...register('password')}
          />
        </FormField>

        <FormField label="Confirm new password" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            hasError={!!errors.confirmPassword}
            {...register('confirmPassword')}
          />
        </FormField>

        <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
          Update password
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-fleet-gray">
        Remembered it after all?{' '}
        <Link to="/login" className="font-semibold text-fleet-black hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}
