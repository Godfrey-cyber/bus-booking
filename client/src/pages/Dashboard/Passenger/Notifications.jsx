import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { HiOutlineTicket, HiOutlineClock, HiOutlineCash, HiOutlineSpeakerphone, HiOutlineBell } from 'react-icons/hi'
import Card from '../../../components/common/Card'
import Button from '../../../components/common/Button'
import EmptyState from '../../../components/common/EmptyState'
import { MOCK_NOTIFICATIONS } from '../../../mock/notifications'
import { setNotifications, markAsRead, markAllAsRead } from '../../../redux/features/notifications/notificationsSlice'
import { formatDate, formatTime } from '../../../utils/format'
import { cn } from '../../../utils/cn'

const ICONS = {
  booking: <HiOutlineTicket className="h-4.5 w-4.5" />,
  reminder: <HiOutlineClock className="h-4.5 w-4.5" />,
  refund: <HiOutlineCash className="h-4.5 w-4.5" />,
  payment: <HiOutlineCash className="h-4.5 w-4.5" />,
  operator: <HiOutlineSpeakerphone className="h-4.5 w-4.5" />,
}

export default function NotificationsPage() {
  const dispatch = useDispatch()
  const items = useSelector((state) => state.notifications.items)

  useEffect(() => {
    if (items.length === 0) dispatch(setNotifications(MOCK_NOTIFICATIONS))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const unreadCount = items.filter((n) => !n.read).length

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-fleet-black">Notifications</h1>
          <p className="mt-1 text-sm text-fleet-gray">{unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={() => dispatch(markAllAsRead())}>
            Mark all as read
          </Button>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-2.5">
        {items.length === 0 && (
          <EmptyState icon={<HiOutlineBell />} title="No notifications yet" description="Booking, payment, and refund updates will show up here." />
        )}

        {items.map((n) => (
          <Card
            key={n.id}
            className={cn('flex items-start gap-3 p-4', !n.read && 'border-fleet-yellow-dark/40 bg-fleet-yellow/[0.04]')}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-fleet-yellow/15 text-fleet-yellow-dark">
              {ICONS[n.type] ?? <HiOutlineBell className="h-4.5 w-4.5" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-fleet-black">{n.title}</p>
                {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-fleet-yellow-dark" aria-label="Unread" />}
              </div>
              <p className="mt-0.5 text-sm text-fleet-gray">{n.message}</p>
              <p className="mt-1 text-xs text-fleet-gray/70">
                {formatDate(n.createdAt)} · {formatTime(n.createdAt)}
              </p>
            </div>
            {!n.read && (
              <button
                onClick={() => dispatch(markAsRead(n.id))}
                className="shrink-0 text-xs font-medium text-fleet-yellow-dark hover:underline"
              >
                Mark read
              </button>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
