import { cn } from '../../utils/cn'

export default function Loader({ size = 24, className, label = 'Loading' }) {
  return (
    <div className={cn('inline-flex items-center gap-2', className)} role="status" aria-live="polite">
      <span
        className="rounded-full border-[3px] border-fleet-black/10 border-t-fleet-yellow animate-spin"
        style={{ width: size, height: size }}
      />
      <span className="sr-only">{label}</span>
    </div>
  )
}
