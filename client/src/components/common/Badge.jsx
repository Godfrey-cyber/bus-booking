import { cn } from '../../utils/cn'

const TONES = {
  neutral: 'bg-fleet-black/5 text-fleet-charcoal',
  yellow: 'bg-fleet-yellow/20 text-fleet-yellow-dark',
  success: 'bg-state-success/10 text-state-success',
  error: 'bg-state-error/10 text-state-error',
  warning: 'bg-state-warning/10 text-state-warning',
  info: 'bg-state-info/10 text-state-info',
}

const Badge = ({ tone = 'neutral', className, children }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold font-mono uppercase tracking-wide',
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  )
}
export default Badge;