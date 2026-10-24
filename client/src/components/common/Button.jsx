import { cn } from '../../utils/cn'

const VARIANTS = {
  primary: 'bg-fleet-yellow text-fleet-black hover:bg-fleet-yellow-dark active:scale-[0.98]',
  dark: 'bg-fleet-black text-fleet-white hover:bg-fleet-charcoal active:scale-[0.98]',
  outline: 'border border-fleet-black/15 text-fleet-black hover:border-fleet-black/40 bg-transparent',
  ghost: 'text-fleet-black hover:bg-fleet-black/5 bg-transparent',
  danger: 'bg-state-error text-white hover:brightness-95',
}

const SIZES = {
  sm: 'text-sm px-3.5 py-2 rounded-lg',
  md: 'text-sm px-5 py-2.5 rounded-xl',
  lg: 'text-base px-6 py-3.5 rounded-xl',
}

const Button = ({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className,
  children,
  leftIcon,
  rightIcon,
  ...props
}) => {
  return (
    <Component
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold font-body transition-all duration-150',
        'disabled:opacity-50 disabled:pointer-events-none',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" aria-hidden="true" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </Component>
  )
}
export default Button