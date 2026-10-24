import { AnimatePresence, motion } from 'framer-motion'
import { HiX } from 'react-icons/hi'

export default function Modal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-fleet-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-fleet-white p-5 shadow-2xl sm:p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-fleet-black">{title}</h2>
              <button onClick={onClose} aria-label="Close dialog" className="text-fleet-gray hover:text-fleet-black">
                <HiX className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
