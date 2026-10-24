import { cn } from '../../utils/cn'

// Wraps a labeled input with consistent spacing and an inline validation message.
// Pass `register` output via {...register('field')} spread on the child input.
export default function FormField({ label, htmlFor, error, children, className }) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-fleet-charcoal">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-state-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export function inputClasses(hasError) {
  return cn(
    'w-full rounded-xl border bg-fleet-white px-3.5 py-2.5 text-sm text-fleet-black placeholder:text-fleet-gray/70',
    'focus:outline-none focus:ring-2 focus:ring-fleet-yellow-dark/40',
    hasError ? 'border-state-error' : 'border-fleet-black/10 focus:border-fleet-yellow-dark'
  )
}
