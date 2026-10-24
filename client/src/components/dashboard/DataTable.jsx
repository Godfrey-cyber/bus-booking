import Card from '../common/Card'
import EmptyState from '../common/EmptyState'
import { HiOutlineInboxIn } from 'react-icons/hi'

// Generic list table shared by operator/admin management pages.
// `columns`: [{ key, label, render?(row) }], `rowKey`: field used as React key.
export default function DataTable({ columns, rows, rowKey = 'id', emptyLabel = 'No records yet' }) {
  if (!rows || rows?.length === 0) {
    return (
      <Card className="p-0">
        <EmptyState icon={<HiOutlineInboxIn />} title={emptyLabel} />
      </Card>
    )
  }

  return (
    <Card className="overflow-x-auto p-0">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-fleet-black/[0.06] text-xs uppercase tracking-wide text-fleet-gray">
            {columns.map((col) => (
              <th key={col.key} className="whitespace-nowrap px-4 py-3 font-semibold">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows?.map((row) => (
            <tr key={row[rowKey]} className="border-b border-fleet-black/[0.04] last:border-0 hover:bg-fleet-black/[0.02]">
              {columns.map((col) => (
                <td key={col.key} className="whitespace-nowrap px-4 py-3.5 text-fleet-charcoal">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
