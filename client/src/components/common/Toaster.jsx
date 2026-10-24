import { useSelector, useDispatch } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import { HiCheckCircle, HiXCircle, HiInformationCircle, HiX } from 'react-icons/hi'
import { dismissToast } from '../../redux/features/notifications/notificationsSlice'
import { cn } from '../../utils/cn'

const ICONS = {
  success: <HiCheckCircle className="h-5 w-5 text-state-success" />,
  error: <HiXCircle className="h-5 w-5 text-state-error" />,
  info: <HiInformationCircle className="h-5 w-5 text-state-info" />,
}

export default function Toaster() {
  const toasts = useSelector((state) => state.notifications.toasts)
  const dispatch = useDispatch()

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40 }}
            className={cn(
              'flex items-start gap-2.5 rounded-xl border border-fleet-black/[0.06] bg-fleet-white p-3.5 shadow-lg'
            )}
            role="status"
          >
            {ICONS[toast.type] ?? ICONS.info}
            <p className="flex-1 text-sm text-fleet-black">{toast.message}</p>
            <button
              onClick={() => dispatch(dismissToast(toast.id))}
              className="text-fleet-gray hover:text-fleet-black"
              aria-label="Dismiss notification"
            >
              <HiX className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
