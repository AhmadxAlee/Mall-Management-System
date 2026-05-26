import { motion } from 'framer-motion'
import { useTheme } from '../../utils/ThemeContext'

const gradients = {
  indigo: 'from-indigo-500 to-purple-600',
  emerald: 'from-emerald-500 to-teal-600',
  amber: 'from-amber-500 to-orange-600',
  rose: 'from-rose-500 to-pink-600',
  sky: 'from-sky-500 to-blue-600',
  violet: 'from-violet-500 to-purple-600',
}

const StatCard = ({ title, value, icon: Icon, color = 'indigo', trend, index = 0 }) => {
  const { isDark } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`rounded-2xl p-6 border card-hover relative overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700/50' : 'bg-white border-slate-100'}`}
      style={{ boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.06)' }}
    >
      {/* Background gradient blob */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-br ${gradients[color]} opacity-10`} />

      <div className="flex items-center justify-between mb-4">
        <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{title}</p>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradients[color]}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>

      <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
        {value ?? '—'}
      </p>
      {trend && <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{trend}</p>}
    </motion.div>
  )
}

export default StatCard