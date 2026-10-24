import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch } from 'react-redux'
import Button from '../../components/common/Button'
import FormField, { inputClasses } from '../../components/forms/FormField'
import PasswordInput from '../../components/forms/PasswordInput'
import Checkbox from '../../components/forms/Checkbox'
import { loginSchema } from '../../utils/validation'
import { useLoginMutation } from '../../redux/services/authApi'
import { setCredentials } from '../../redux/features/auth/authSlice'
import { storeSession } from '../../utils/session'
import { useToast } from '../../hooks/useToast'
import { ROLES } from '../../constants/roles'

const ROLE_HOME = {
    [ROLES.PASSENGER]: '/dashboard',
    [ROLES.OPERATOR]: '/operator',
    [ROLES.ADMIN]: '/admin',
}

const LoginPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(loginSchema), defaultValues: { rememberMe: true } })

    const [login, { isLoading }] = useLoginMutation()
    const [serverError, setServerError] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const toast = useToast()

    const onSubmit = async (values) => {
        setServerError('')

        try {
            const result = await login(values).unwrap()
            console.log("result", result)

            if (result?.error) {
                setServerError(result?.error?.data?.message ?? 'Something went wrong. Please try again.')
                console.log("result", result)
                return
            }

            // Handle nested response shapes cleanly
            const authData = result?.data?.data ?? result?.data ?? result;

            if (!authData?.accessToken && !authData?.token) {
                throw new Error("Invalid response format: Missing access token.")
            }
            console.log("authData", authData);

            dispatch(setCredentials(authData));

            // Persist session
            const storage = values.rememberMe ? localStorage : sessionStorage
            storage.setItem('auth', JSON.stringify(authData));

            storeSession(authData, values.rememberMe);

            console.log("authData", authData)

            toast.success(`Welcome back, ${authData?.user?.role_id == 3 ? authData?.user?.company_name : authData?.user?.first_name.split(' ')[0]}!`)
            const redirectTo = location.state?.from?.pathname ?? ROLE_HOME[authData?.user.role] ?? '/'
            navigate(redirectTo, { replace: true })
        } catch(error) {
            console.error("Login Error:", error)
            // .unwrap() throws backend errors directly into this catch block
            const message = 
                error?.data?.message || 
                error?.data?.error || 
                error?.message || 
                'Something went wrong. Please try again.'

            setServerError(message)
        }
    }

    return (
        <div>
            <h1 className="font-display text-2xl font-bold text-fleet-black">Log in to FleetGo</h1>
            <p className="mt-1.5 text-sm text-fleet-gray">Welcome back. Enter your details to continue.</p>

            <div className="mt-4 rounded-xl bg-fleet-yellow/10 px-3.5 py-2.5 text-xs text-fleet-charcoal">
            Demo accounts: <span className="font-mono">passenger@demo.com</span>,{' '}
            <span className="font-mono">operator@demo.com</span>, <span className="font-mono">admin@demo.com</span> —
            password <span className="font-mono">password</span>
            </div>

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

                <FormField label="Password" htmlFor="password" error={errors.password?.message}>
                    <PasswordInput
                        id="password"
                        autoComplete="current-password"
                        hasError={!!errors.password}
                        {...register('password')}
                    />
                </FormField>

                <div className="flex items-center justify-between">
                    <Checkbox id="rememberMe" label="Remember me" {...register('rememberMe')} />
                    <Link to="/forgot-password" className="text-sm font-medium text-fleet-yellow-dark hover:underline">
                        Forgot password?
                    </Link>
                </div>

                {serverError && (
                    <p className="rounded-lg bg-state-error/10 px-3 py-2 text-sm text-state-error" role="alert">
                        {serverError}
                    </p>
                )}

                <Button type="submit" size="lg" isLoading={isLoading} className="mt-1 w-full">
                    Log in
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-fleet-gray">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-fleet-black hover:underline">
                    Sign up
                </Link>
            </p>
        </div>
    )
}

export default LoginPage