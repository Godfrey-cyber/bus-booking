import DataTable from '../../../components/dashboard/DataTable'
import { AUDIT_LOGS } from '../../../mock/adminData'
import { formatDate, formatTime } from '../../../utils/format'

export default function AdminAuditLogs() {
  const columns = [
    { key: 'action', label: 'Action', render: (row) => <span className="font-mono text-xs">{row.action}</span> },
    { key: 'entity', label: 'Entity' },
    { key: 'actor', label: 'Actor' },
    { key: 'at', label: 'When', render: (row) => `${formatDate(row.at)} · ${formatTime(row.at)}` },
  ]

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-fleet-black">Audit logs</h1>
      <p className="mt-1 text-sm text-fleet-gray">A trail of sensitive actions taken across the platform.</p>

      <div className="mt-6">
        <DataTable columns={columns} rows={AUDIT_LOGS} emptyLabel="No audit events recorded yet" />
      </div>
    </div>
  )
}
