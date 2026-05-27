import { motion } from 'framer-motion'

const StatCard = ({ title, value, icon: Icon, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-white/50">{title}</p>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#c026d3' }}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold text-white">{value ?? '—'}</p>
    </motion.div>
  )
}

export default StatCard