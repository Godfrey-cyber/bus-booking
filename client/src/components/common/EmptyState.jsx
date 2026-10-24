import Button from './Button'

export default function EmptyState({ icon, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-fleet-yellow/15 text-fleet-yellow-dark text-2xl">
          {icon}
        </div>
      )}
      <h3 className="font-display text-lg font-semibold text-fleet-black">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-fleet-gray">{description}</p>}
      {actionLabel && onAction && (
        <Button className="mt-5" onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
