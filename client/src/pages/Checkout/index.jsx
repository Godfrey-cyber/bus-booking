import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, useFieldArray } from 'react-hook-form'
import { HiOutlineTicket, HiOutlineTag } from 'react-icons/hi'
import Container from '../../components/common/Container'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Skeleton from '../../components/common/Skeleton'
import Checkbox from '../../components/forms/Checkbox'
import FormField, { inputClasses } from '../../components/forms/FormField'

import { useGetTripByIdQuery } from '../../redux/services/tripsApi'

import { useGetBusByIdQuery } from '../../redux/services/busesApi'
import { useCreateBookingMutation } from '../../redux/services/paymentsApi'
import { setPassengerDetails, setEmergencyContact, applyPromoCode, selectSeatTotal } from '../../redux/features/cart/cartSlice'
import { useCountdown } from '../../hooks/useCountdown'
import { useToast } from '../../hooks/useToast'
import { formatCurrency } from '../../utils/format'
import { useAuth } from '../../hooks/useAuth'

const SERVICE_FEE = 100
const PROMO_CODES = { SAVE10: 0.1, WEEKENDER: 200 } // percent (0-1) or flat KES amount >= 1

const CheckoutPage = () => {
    const { trip_id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { isAuthenticated, user } = useAuth()
    const toast = useToast()

    const { data: journey, isLoading: isTripLoading } = useGetTripByIdQuery(trip_id, { skip: !trip_id
     })
    const trip = journey?.[0]
    const { data: bus, isLoading: isBusLoading } = useGetBusByIdQuery(trip?.bus_id, {
        skip: !trip?.bus_id
    })

    // console.log("user", user)

    const selectedSeats = useSelector((state) => state?.cart.selectedSeats)
    const cart = useSelector((state) => state?.cart)
    const reservationExpiresAt = useSelector((state) => state?.cart.reservationExpiresAt)
    const subtotal = useSelector(selectSeatTotal)
    const countdown = useCountdown(reservationExpiresAt)
    const [createBooking, { isLoading: isCreating }] = useCreateBookingMutation()

    const [promoInput, setPromoInput] = useState('')
    const [appliedPromo, setAppliedPromo] = useState(null)
    const [promoError, setPromoError] = useState('')

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
      } = useForm({
        defaultValues: {
          passengers: selectedSeats?.map((seat) => ({ seat_number: seat?.seat_number, name: '', age: '', gender: 'Female' })),
          emergencyName: '',
          emergencyPhone: '',
          agreeToTerms: false,
        },
    })

    const { fields } = useFieldArray({ control, name: 'passengers' })

    useEffect(() => {
        if (selectedSeats?.length === 0 && trip?.bus_id) {
            navigate(`/buses/${trip?.bus_id}`, { replace: true })
        }
    }, [selectedSeats?.length, trip?.bus_id, navigate])

    useEffect(() => {
        if (countdown.isExpired && reservationExpiresAt) {
            toast.error('Your seat hold expired. Please choose your seats again.')
            navigate(`/buses/${trip?.bus_id}`, { replace: true })
        }
    }, [countdown.isExpired, reservationExpiresAt, trip?.bus_id, navigate, toast])

    const applyPromo = () => {
        const code = promoInput.trim().toUpperCase()
        const rule = PROMO_CODES[code]
        if (!rule) {
            setPromoError('That promo code is not valid or has expired.')
            setAppliedPromo(null)
            return
        }
        setPromoError('')
        setAppliedPromo({ code, rule })
        toast.success(`Promo code ${code} applied.`)
    }

    const discount = appliedPromo ? (appliedPromo.rule < 1 ? subtotal * appliedPromo.rule : appliedPromo.rule) : 0
    const total = Math.max(subtotal + SERVICE_FEE - discount, 0)

    const onSubmit = async (values) => {
        const passengers = values.passengers.map((p, i) => ({ ...p, age: Number(p.age), price: selectedSeats[i]?.price }))
        dispatch(setPassengerDetails(passengers))
        dispatch(setEmergencyContact({ name: values.emergencyName, phone: values.emergencyPhone }))
        if (appliedPromo) dispatch(applyPromoCode(appliedPromo.code))

        const result = await createBooking({
            trip_id: trip_id,
            // booking_reference,
            schedule_id: trip?.schedule_id,
            user_id: user?._id,
            passengers,
            passenger_count: passengers.length,
            emergency_contact_name: values.emergencyName,
            emergency_contact_phone: values.emergencyPhone,
            seats: selectedSeats,
            subtotal,
            discount_amount: discount,
            tax_amount: SERVICE_FEE,
            total_amount: total,
            promo_code_id: appliedPromo?.id ?? null
        })
        console.log(result) 

        if (result?.error) {
            toast.error('Something went wrong creating your booking. Please try again.')
            return
        }

        navigate(`/booking/${trip_id}/payment`, { state: { booking: result?.data } })
    }
    // console.log(result)

    if (isTripLoading || selectedSeats?.length === 0) {
        return (
            <Container className="py-8">
                <Skeleton className="h-8 w-56" />
                <Skeleton className="mt-4 h-96 w-full rounded-2xl" />
            </Container>
        )
    }

    return (
        <Container className="py-6 sm:py-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-xl font-bold text-fleet-black sm:text-2xl">Passenger details</h1>
              <p className="text-sm text-fleet-gray">
                {trip?.operator_name} · {trip?.origin} → {trip?.destination}
              </p>
            </div>
            {reservationExpiresAt && (
              <span className="rounded-full bg-fleet-yellow/15 px-3 py-1.5 font-mono text-xs font-semibold text-fleet-yellow-dark">
                Seats held — {countdown.label}
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]" noValidate>
            <div className="flex flex-col gap-5">
              <Card className="p-5">
                <h2 className="font-display text-sm font-semibold text-fleet-black">Passenger details</h2>
                <div className="mt-4 flex flex-col gap-5">
                  {fields.map((field, index) => (
                    <div key={field.id} className="rounded-xl border border-fleet-black/[0.06] p-4">
                      <p className="mb-3 font-mono text-xs font-semibold text-fleet-yellow-dark">
                        Seat {selectedSeats[index]?.seat_number}
                      </p>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <FormField label="Full name" htmlFor={`passengers.${index}.name`} error={errors.passengers?.[index]?.name?.message}>
                          <input
                            id={`passengers.${index}.name`}
                            className={inputClasses(!!errors.passengers?.[index]?.name)}
                            {...register(`passengers.${index}.name`, { required: 'Required' })}
                          />
                        </FormField>
                        <FormField label="Age" htmlFor={`passengers.${index}.age`} error={errors.passengers?.[index]?.age?.message}>
                          <input
                            id={`passengers.${index}.age`}
                            type="number"
                            min="0"
                            className={inputClasses(!!errors.passengers?.[index]?.age)}
                            {...register(`passengers.${index}.age`, { required: 'Required' })}
                          />
                        </FormField>
                        <FormField label="Gender" htmlFor={`passengers.${index}.gender`}>
                          <select id={`passengers.${index}.gender`} className={inputClasses(false)} {...register(`passengers.${index}.gender`)}>
                            <option>Female</option>
                            <option>Male</option>
                            <option>Other</option>
                          </select>
                        </FormField>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-5">
                <h2 className="font-display text-sm font-semibold text-fleet-black">Emergency contact</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <FormField label="Contact name" htmlFor="emergencyName" error={errors.emergencyName?.message}>
                    <input id="emergencyName" className={inputClasses(!!errors.emergencyName)} {...register('emergencyName', { required: 'Required' })} />
                  </FormField>
                  <FormField label="Contact phone" htmlFor="emergencyPhone" error={errors.emergencyPhone?.message}>
                    <input
                      id="emergencyPhone"
                      placeholder="+254 7XX XXX XXX"
                      className={inputClasses(!!errors.emergencyPhone)}
                      {...register('emergencyPhone', { required: 'Required' })}
                    />
                  </FormField>
                </div>
              </Card>
            </div>

            <Card className="sticky top-24 h-fit p-5">
              <h2 className="font-display text-sm font-semibold text-fleet-black">Order summary</h2>

              <ul className="mt-3 flex flex-col gap-1.5">
                {selectedSeats.map((seat) => (
                  <li key={seat.seat_number} className="flex justify-between text-sm">
                    <span className="text-fleet-charcoal">Seat {seat.seat_number}</span>
                    <span className="text-fleet-gray">{formatCurrency(seat.price)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 border-t border-fleet-black/[0.06] pt-3">
                <label htmlFor="promo" className="text-xs font-semibold uppercase tracking-wide text-fleet-gray">
                  Promo code
                </label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    id="promo"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="e.g. SAVE10"
                    className={inputClasses(!!promoError)}
                  />
                  <Button type="button" variant="outline" size="sm" leftIcon={<HiOutlineTag className="h-4 w-4" />} onClick={applyPromo}>
                    Apply
                  </Button>
                </div>
                {promoError && <p className="mt-1 text-xs text-state-error">{promoError}</p>}
              </div>

              <div className="mt-4 flex flex-col gap-1.5 border-t border-fleet-black/[0.06] pt-4 text-sm">
                <div className="flex justify-between text-fleet-gray">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-fleet-gray">
                  <span>Service fee</span>
                  <span>{formatCurrency(SERVICE_FEE)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-state-success">
                    <span>Discount ({appliedPromo.code})</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="mt-1 flex justify-between border-t border-fleet-black/[0.06] pt-2 font-display text-base font-bold text-fleet-black">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="mt-4 border-t border-fleet-black/[0.06] pt-4">
                <Checkbox id="agreeToTerms" label="I accept the Terms and Conditions and fare rules" {...register('agreeToTerms', { required: true })} />
                {errors.agreeToTerms && <p className="mt-1 text-xs text-state-error">You must accept the terms to continue.</p>}
              </div>

              <Button type="submit" size="lg" className="mt-5 w-full" isLoading={isCreating} leftIcon={<HiOutlineTicket className="h-4.5 w-4.5" />}>
                Proceed to payment
              </Button>
            </Card>
          </form>
        </Container>
    )
}

export default CheckoutPage