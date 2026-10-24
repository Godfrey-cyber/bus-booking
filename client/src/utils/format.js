import { format, parseISO } from 'date-fns'

export function formatCurrency(amount, currency = 'KES') {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(isoString, pattern = 'EEE, d MMM yyyy') {
  if (!isoString) return ''
  const date = typeof isoString === 'string' ? parseISO(isoString) : isoString
  return format(date, pattern)
}

export function formatTime(isoString) {
  if (!isoString) return ''
  const date = typeof isoString === 'string' ? parseISO(isoString) : isoString
  return format(date, 'h:mm a')
}

export function formatDuration(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m > 0 ? `${m}m` : ''}`.trim()
}
