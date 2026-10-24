import { cn } from '../../utils/cn'

const Card = ({ className, children, as: Component = 'div', ...props }) => {
  return (
    <Component
      className={cn(
        'bg-fleet-white rounded-2xl border border-fleet-black/[0.06] shadow-[0_1px_2px_rgba(11,11,12,0.04),0_8px_24px_-12px_rgba(11,11,12,0.12)]',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Card
