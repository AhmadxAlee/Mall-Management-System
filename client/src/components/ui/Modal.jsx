import { X } from 'lucide-react'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60"
            style={{ backdropFilter: 'blur(8px)' }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
            style={{
              background: 'rgba(26,5,51,0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(244,114,182,0.2)',
            }}
          >
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-pink-300 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default Modal