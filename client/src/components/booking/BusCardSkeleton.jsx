import Card from '../common/Card'
import Skeleton from '../common/Skeleton'

export default function BusCardSkeleton() {
  return (
    <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-14" />
          </div>
        </div>
        <div className="flex items-center gap-8">
          <Skeleton className="h-6 w-14" />
          <Skeleton className="h-px flex-1" />
          <Skeleton className="h-6 w-14" />
        </div>
        <Skeleton className="h-3 w-40" />
      </div>
      <div className="flex flex-col items-end gap-3">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>
    </Card>
  )
}
