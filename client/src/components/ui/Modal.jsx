import { X } from 'lucide-react'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../utils/ThemeContext'

const Modal = ({ isOpen, onClose, title, children }) => {
  const { isDark } = useTheme()

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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`relative rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}
          >
            <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{title}</h2>
              <button
                onClick={onClose}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:bg-slate-700 hover:text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
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