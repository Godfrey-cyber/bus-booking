import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { HiOutlinePlus, HiOutlineBan, HiOutlineCheckCircle, HiStar } from 'react-icons/hi'
import DataTable from '../../../components/dashboard/DataTable'
import Button from '../../../components/common/Button'
import Badge from '../../../components/common/Badge'
import Modal from '../../../components/common/Modal'
import ConfirmDialog from '../../../components/common/ConfirmDialog'
import FormField, { inputClasses } from '../../../components/forms/FormField'
import { ADMIN_OPERATORS } from '../../../mock/adminData'
import { useToast } from '../../../hooks/useToast'
import { formatDate } from '../../../utils/format'
import { useAuth } from '../../../hooks/useAuth'
import { useSearchOperatorsQuery, useCreateOperatorMutation, useUpdateOperatorStatusMutation } from '../../../redux/services/operatorsApi'
import { useGetOperatorsQuery } from '../../../redux/services/authApi'
// 
export default function AdminOperators() {
  // const [operators, setOperators] = useState(ADMIN_OPERATORS)
  const [isAdding, setIsAdding] = useState(false)
  const [statusTarget, setStatusTarget] = useState(null) // { operator, nextStatus }
  const toast = useToast()

  const { user } = useAuth()
  console.log("user", user)
  const { data: operatorsData, isLoading } = useGetOperatorsQuery();
  // console.log("Admin Overview", user)
  const operators = Array.isArray(operatorsData?.data)
    ? operatorsData.data
    : Array.isArray(operatorsData)
    ? operatorsData
    : []
  console.log("Admin Overview", operators)

  // 2. RTK Query Mutations
  const [createOperator, { isLoading: isOnboarding }] = useCreateOperatorMutation()
  const [updateOperatorStatus, { isLoading: isUpdatingStatus }] = useUpdateOperatorStatusMutation()

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: '', contact_email: '', contact_phone: '', slug: '', logo_url: '' },
  })

  // 3. API Onboard Submission Handler
  const onSubmit = async (values) => {
    try {
      const payload = {
        name: values.name,
        contact_email: values.contact_email,
        contact_phone: values.contact_phone,
        slug: values.slug,
        logo_url: values.logo_url,
      }

      await createOperator(payload).unwrap()
      toast.success('Operator onboarded successfully.')
      reset()
      setIsAdding(false)
    } catch (error) {
      console.error('Failed to onboard operator:', error)
      toast.error(error?.data?.message || 'Failed to onboard operator.')
    }
  }

  console.log("nextStatus", statusTarget?.nextStatus)
  // console.log("operator", Number(statusTarget.operator.id))
  console.log("statusTarget", statusTarget)

    // 4. API Status Update Handler
    const confirmStatusChange = async () => {
        if (!statusTarget) return

        try {
            await updateOperatorStatus({
                id: statusTarget?.operator?.id,
                status: statusTarget?.nextStatus,
            }).unwrap()

            toast.success(
                statusTarget.nextStatus === 'suspended'
                  ? 'Operator suspended.'
                  : 'Operator reactivated.'
            )

            setStatusTarget(null)

        } catch (error) {
            console.error('Failed to update operator status:', error)
            toast.error(error?.data?.message || 'Failed to update status.')
        }
    }

  const columns = [
    { key: 'company_name', label: 'Operator' },
    { key: 'company_email', label: 'Contact email' },
    { key: 'buses', label: 'Buses' },
    { key: 'rating_avg', label: 'Rating', render: (row) => (row.rating_avg ? <span className="flex items-center gap-1"><HiStar className="h-3.5 w-3.5 text-fleet-yellow-dark" /> {row.rating_avg}</span> : '—') },
    { key: 'created_at', label: 'Joined', render: (row) => formatDate(row.created_at) },
    { key: 'status', label: 'Status', render: (row) => <Badge tone={row.status === 'active' ? 'success' : 'error'}>{row.status}</Badge> },
    {
      key: 'actions',
      label: '',
      render: (row) =>
        row.status === 'active' ? (
          <Button
            size="sm"
            variant="outline"
            leftIcon={<HiOutlineBan className="h-3.5 w-3.5" />}
            onClick={() => setStatusTarget({ operator: row, nextStatus: 'suspended' })}
          >
            Suspend
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            leftIcon={<HiOutlineCheckCircle className="h-3.5 w-3.5" />}
            onClick={() => setStatusTarget({ operator: row, nextStatus: 'active' })}
          >
            Reactivate
          </Button>
        ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-fleet-black">Operators</h1>
          <p className="mt-1 text-sm text-fleet-gray">Every operator company onboarded to FleetGo.</p>
        </div>
        <Button leftIcon={<HiOutlinePlus className="h-4 w-4" />} onClick={() => setIsAdding(true)}>
          Onboard operator
        </Button>
      </div>

      <div className="mt-6">
        <DataTable columns={columns} rows={operators} emptyLabel="No operators yet" />
      </div>

      <Modal isOpen={isAdding} onClose={() => setIsAdding(false)} title="Onboard operator">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <FormField label="Company Name" htmlFor="opName">
            <input id="opName" className={inputClasses(false)} {...register('name', { required: true })} />
          </FormField>
          <FormField label="Contact email" htmlFor="opEmail">
            <input id="opEmail" type="email" className={inputClasses(false)} {...register('contact_email', { required: true })} />
          </FormField>
          <FormField label="Contact Phone" htmlFor="opPhone">
            <input id="opPhone" type="phone" className={inputClasses(false)} {...register('contact_phone', { required: true })} />
          </FormField>
          <FormField label="Slug" htmlFor="opSlug">
            <input id="opSlug" type="slug" className={inputClasses(false)} {...register('slug', { required: true })} />
          </FormField>
          <FormField label="Company Logo" htmlFor="opLogo">
            <input id="opLogo" type="logo" className={inputClasses(false)} {...register('logo_url', { required: true })} />
          </FormField>
          <Button type="submit" className="mt-1 w-full">
            Onboard operator
          </Button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!statusTarget}
        onClose={() => setStatusTarget(null)}
        onConfirm={confirmStatusChange}
        title={statusTarget?.nextStatus === 'suspended' ? 'Suspend this operator?' : 'Reactivate this operator?'}
        description={
          statusTarget?.nextStatus === 'suspended'
            ? `${statusTarget?.operator.company_name} will be hidden from search and unable to accept new bookings.`
            : `${statusTarget?.operator.company_name} will be visible again and able to accept bookings.`
        }
        confirmLabel={statusTarget?.nextStatus === 'suspended' ? 'Suspend' : 'Reactivate'}
        isDangerous={statusTarget?.nextStatus === 'suspended'}
      />
    </div>
  )
}
