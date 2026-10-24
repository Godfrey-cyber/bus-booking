import DataTable from '../../../components/dashboard/DataTable'
import Badge from '../../../components/common/Badge'
import { ADMIN_PAYMENTS } from '../../../mock/adminData'
import { formatCurrency, formatDate } from '../../../utils/format'

import { useSearchPaymentsQuery } from '../../../redux/services/paymentsApi'

const STATUS_TONE = { success: 'success', pending: 'warning', processing: 'info', failed: 'error', cancelled: 'error', refunded: 'warning' }
const METHOD_LABEL = { mpesa: 'M-Pesa', card: 'Card', wallet: 'Wallet', bank_transfer: 'Bank transfer' }

export default function AdminPayments() {
    const { data: payments, isLoading } = useSearchPaymentsQuery({
        page: 1, 
        limit: 20
        // status: "success" 
    });
  console.log("payments", payments)
  console.log("isLoading", isLoading)
  const columns = [
    { key: 'booking_ref', label: 'Booking ref', render: (row) => <span className="font-mono text-xs">{row.booking_reference}</span> },
    { key: 'Method', label: 'Method', render: (row) => METHOD_LABEL[row.method] ?? row.method },
    { key: 'Amount', label: 'Amount', render: (row) => formatCurrency(row.amount) },
    { key: 'createdAt', label: 'Date', render: (row) => formatDate(row.paid_at) },
    { key: 'status', label: 'Status', render: (row) => <Badge tone={STATUS_TONE[row.status]}>{row.status}</Badge> },
  ]
  const totalSuccess = payments?.filter((payment) => payment.status === 'success').reduce((total, payment) => total + Number(payment.amount), 0)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-fleet-black">Payments</h1>
          <p className="mt-1 text-sm text-fleet-gray">Transaction records across every payment method.</p>
        </div>
        <div className="rounded-xl bg-fleet-yellow/10 px-4 py-2.5 text-sm">
          <span className="text-fleet-gray">Settled this period: </span>
          <span className="font-semibold text-fleet-black">{formatCurrency(totalSuccess)}</span>
        </div>
      </div>

      <div className="mt-6">
        <DataTable columns={columns} rows={payments} emptyLabel="No payments recorded yet" />
      </div>
    </div>
  )
}
