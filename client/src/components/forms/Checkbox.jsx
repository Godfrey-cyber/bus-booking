import { forwardRef } from 'react'

const Checkbox = forwardRef(function Checkbox({ label, id, ...props }, ref) {
  return (
    <label htmlFor={id} className="flex select-none items-center gap-2 text-sm text-fleet-charcoal">
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className="h-4 w-4 rounded border-fleet-black/20 text-fleet-yellow-dark focus:ring-fleet-yellow-dark/40"
        {...props}
      />
      {label}
    </label>
  )
})

export default Checkbox
