import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { HiOutlineMailOpen, HiArrowLeft } from 'react-icons/hi'
import Button from '../../components/common/Button'
import FormField, { inputClasses } from '../../components/forms/FormField'
import { forgotPasswordSchema } from '../../utils/validation'
import { useForgotPasswordMutation } from '../../redux/services/authApi'

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) })
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()
  const [sent, setSent] = useState(false)

  const onSubmit = async (values) => {
    const result = await forgotPassword(values)
    if (!result.error) setSent(true)
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-fleet-yellow/15 text-fleet-yellow-dark">
          <HiOutlineMailOpen className="h-6 w-6" />
        </div>
        <h1 className="mt-4 font-display text-xl font-bold text-fleet-black">Check your inbox</h1>
        <p className="mt-1.5 text-sm text-fleet-gray">
          If an account exists for <span className="font-medium text-fleet-black">{getValues('email')}</span>, a
          reset link is on its way.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-fleet-black hover:underline"
        >
          <HiArrowLeft className="h-4 w-4" /> Back to log in
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-fleet-black">Reset your password</h1>
      <p className="mt-1.5 text-sm text-fleet-gray">
        Enter the email on your account and we'll send a reset link.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4" noValidate>
        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={inputClasses(!!errors.email)}
            {...register('email')}
          />
        </FormField>

        <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
          Send reset link
        </Button>
      </form>

      <Link
        to="/login"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-fleet-black hover:underline"
      >
        <HiArrowLeft className="h-4 w-4" /> Back to log in
      </Link>
    </div>
  )
}
