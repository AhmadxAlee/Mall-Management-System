import { motion } from 'framer-motion'

const gradients = {
  indigo: 'linear-gradient(135deg, #667eea, #764ba2)',
  emerald: 'linear-gradient(135deg, #43e97b, #38f9d7)',
  amber: 'linear-gradient(135deg, #f093fb, #f5576c)',
  rose: 'linear-gradient(135deg, #fa709a, #fee140)',
  sky: 'linear-gradient(135deg, #4facfe, #00f2fe)',
  violet: 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
}

const StatCard = ({ title, value, icon: Icon, color = 'indigo', trend, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="rounded-2xl p-6 card-hover relative overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10"
        style={{ background: gradients[color] }} />

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-pink-200">{title}</p>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: gradients[color] }}>
          <Icon size={20} className="text-white" />
        </div>
      </div>

      <p className="text-3xl font-bold text-white">{value ?? '—'}</p>
      {trend && <p className="text-xs mt-1 text-pink-300">{trend}</p>}
    </motion.div>
  )
}

export default StatCard