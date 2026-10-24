import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch } from 'react-redux'
import Button from '../../components/common/Button'
import FormField, { inputClasses } from '../../components/forms/FormField'
import PasswordInput from '../../components/forms/PasswordInput'
import Checkbox from '../../components/forms/Checkbox'
import { passengerRegisterSchema, operatorRegisterSchema } from '../../utils/validation'
import { useRegisterOperatorMutation, useRegisterPassengerMutation, } from '../../redux/services/authApi'
import { setCredentials } from '../../redux/features/auth/authSlice'
import { storeSession } from '../../utils/session'
import { useToast } from '../../hooks/useToast'

export default function RegisterPage() {
  const [role, setRole] = useState('Passenger'); // 'passenger' | 'operator'
  const [serverError, setServerError] = useState('');

  const [registerOperator, { isLoading: isOperatorLoading }] = useRegisterOperatorMutation();
  const [registerPassenger, { isLoading: isPassengerLoading }] = useRegisterPassengerMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const activeSchema = role === 'Passenger' ? passengerRegisterSchema : operatorRegisterSchema;

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm({ resolver: zodResolver(registerSchema) })


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(activeSchema),
    mode: 'onTouched',
  });

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setServerError('');
    reset(); // Clear input fields and errors on role switch
  };

const onSubmit = async (data) => {
    setServerError('');
    const { confirmPassword, agreeToTerms, ...payload } = data;

    try {
        const registerFn = role === 'Operator' ? registerOperator : registerPassenger;
        const result = await registerFn(payload).unwrap();

        dispatch(setCredentials(result));
        storeSession(result, true);
        toast.success('Account created — welcome to FleetGo!');
        navigate('/login', { replace: true });
    } catch (err) {
        console.log("err", err)
        setServerError(err?.data?.message || 'Registration failed. Please try again.');
    }
};

  const isLoading = isOperatorLoading || isPassengerLoading;

  // const onSubmit = async ({ confirmPassword: _confirmPassword, agreeToTerms: _agreeToTerms, ...values }) => {
  //   setServerError('')
  //   const result = await registerUser(values)
  //   console.log("login result", result)
  //   if (result.error) {
  //     setServerError(result.error.data?.message ?? 'Something went wrong. Please try again.')
  //     return
  //   }
  //   dispatch(setCredentials(result.data))
  //   storeSession(result.data, true)
  //   toast.success('Account created — welcome to FleetGo!')
  //   navigate('/dashboard', { replace: true })
  // }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-fleet-black">Create your account</h1>
      <p className="mt-1.5 text-sm text-fleet-gray">Book your first trip in under two minutes.</p>

      {/* Role Selector Tabs */}
      <div className="mt-6 flex rounded-lg bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => handleRoleChange('Passenger')}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
            role === 'passenger' ? 'bg-white text-fleet-black shadow-sm' : 'text-fleet-gray hover:text-fleet-black'
          }`}
        >
          Passenger
        </button>
        <button
          type="button"
          onClick={() => handleRoleChange('Operator')}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
            role === 'Operator' ? 'bg-white text-fleet-black shadow-sm' : 'text-fleet-gray hover:text-fleet-black'
          }`}
        >
          Operator / Business
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4" noValidate>
        {role === 'Passenger' ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="First Name" htmlFor="first_name" error={errors.first_name?.message}>
                <input
                  id="first_name"
                  type="text"
                  autoComplete="given-name"
                  className={inputClasses(!!errors.first_name)}
                  {...register('first_name')}
                />
              </FormField>

              <FormField label="Last Name" htmlFor="last_name" error={errors.last_name?.message}>
                <input
                  id="last_name"
                  type="text"
                  autoComplete="family-name"
                  className={inputClasses(!!errors.last_name)}
                  {...register('last_name')}
                />
              </FormField>
            </div>

            <FormField label="Email Address" htmlFor="email" error={errors.email?.message}>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={inputClasses(!!errors.email)}
                {...register('email')}
              />
            </FormField>

            <FormField label="Phone Number" htmlFor="phone" error={errors.phone?.message}>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+254 7XX XXX XXX"
                className={inputClasses(!!errors.phone)}
                {...register('phone')}
              />
            </FormField>
          </>) : (
          <>
            <FormField label="Company Name" htmlFor="company_name" error={errors.company_name?.message}>
              <input
                id="company_name"
                type="text"
                autoComplete="organization"
                className={inputClasses(!!errors.company_name)}
                {...register('company_name')}
              />
            </FormField>

            <FormField label="Company Email" htmlFor="company_email" error={errors.company_email?.message}>
              <input
                id="company_email"
                type="email"
                autoComplete="email"
                className={inputClasses(!!errors.company_email)}
                {...register('company_email')}
              />
            </FormField>

            <FormField label="Company Phone" htmlFor="company_phone" error={errors.company_phone?.message}>
              <input
                id="company_phone"
                type="tel"
                autoComplete="tel"
                placeholder="+254 7XX XXX XXX"
                className={inputClasses(!!errors.company_phone)}
                {...register('company_phone')}
              />
            </FormField>
          </>
        )}
        {/*<FormField label="Fisrt Name" htmlFor="first_name" error={errors.name?.message}>
          <input id="first_name" autoComplete="first_name" className={inputClasses(!!errors.name)} {...register('first_name')} />
        </FormField>*/}
        {/*<FormField label="Company Name" htmlFor="company_name" error={errors.company_name?.message}>
          <input id="company_name" autoComplete="company_name" className={inputClasses(!!errors.company_name)} {...register('company_name')} />
        </FormField>*/}
        {/*<FormField label="Last Name" htmlFor="last_name" error={errors.name?.message}>
          <input id="last_name" autoComplete="last_name" className={inputClasses(!!errors.name)} {...register('last_name')} />
        </FormField>*/}

        {/*<FormField label="Company Email" htmlFor="company_email" error={errors.company_email?.message}>
          <input
            id="company_email"
            type="company_email"
            autoComplete="company_email"
            className={inputClasses(!!errors.company_email)}
            {...register('company_email')}
          />
        </FormField>

        <FormField label="Company Phone" htmlFor="company_phone" error={errors.company_phone?.message}>
          <input
            id="company_phone"
            type="tel"
            autoComplete="tel"
            placeholder="+254 7XX XXX XXX"
            className={inputClasses(!!errors.company_phone)}
            {...register('company_phone')}
          />
        </FormField>*/}

        <FormField label="Password" htmlFor="password" error={errors.password?.message}>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            hasError={!!errors.password}
            {...register('password')}
          />
        </FormField>

        <FormField label="Confirm Password" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            hasError={!!errors.confirmPassword}
            {...register('confirmPassword')}
          />
        </FormField>

        <Checkbox
          id="agreeToTerms"
          label="I agree to the Terms of Service and Privacy Policy"
          {...register('agreeToTerms')}
        />
        {errors.agreeToTerms && <p className="-mt-2 text-xs text-state-error">{errors.agreeToTerms.message}</p>}

        {serverError && (
          <p className="rounded-lg bg-state-error/10 px-3 py-2 text-sm text-state-error" role="alert">
            {serverError}
          </p>
        )}

        <Button type="submit" size="lg" isLoading={isLoading} className="mt-1 w-full">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-fleet-gray">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-fleet-black hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}
