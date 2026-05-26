import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Users, Tag, Store, UtensilsCrossed, Package, AlertTriangle, Sparkles, TrendingUp } from 'lucide-react'
import { fetchStats, fetchRecentActivity, fetchInventoryOverview, fetchAISummary } from '../features/dashboard/dashboardSlice'
import StatCard from '../components/ui/StatCard'
import Badge from '../components/ui/Badge'
import { useTheme } from '../utils/ThemeContext'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { stats, recentActivity, inventoryOverview, aiSummary, aiLoading } = useSelector((state) => state.dashboard)
  const { user } = useSelector((state) => state.auth)
  const { isDark } = useTheme()

  useEffect(() => {
    dispatch(fetchStats())
    dispatch(fetchRecentActivity())
    dispatch(fetchInventoryOverview())
    dispatch(fetchAISummary())
  }, [dispatch])

  const statCards = [
    { title: 'Total Employees', value: stats?.totalEmployees, icon: Users, color: 'indigo' },
    { title: 'Total Brands', value: stats?.totalBrands, icon: Tag, color: 'violet' },
    { title: 'Total Outlets', value: stats?.totalOutlets, icon: Store, color: 'sky' },
    { title: 'Food Courts', value: stats?.totalFoodCourts, icon: UtensilsCrossed, color: 'emerald' },
    { title: 'Total Products', value: stats?.totalProducts, icon: Package, color: 'amber' },
    { title: 'Low Stock Alerts', value: stats?.lowStockProducts, icon: AlertTriangle, color: 'rose' },
  ]

  const roleColor = { admin: 'rose', manager: 'indigo', employee: 'emerald' }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className={`rounded-2xl p-6 relative overflow-hidden`} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white rounded-full opacity-5" />
            <div className="absolute -right-5 top-10 w-20 h-20 bg-white rounded-full opacity-5" />
          </div>
          <div className="relative z-10">
            <p className="text-indigo-200 text-sm font-medium mb-1">{getGreeting()}</p>
            <h1 className="text-white text-2xl font-bold mb-1">{user?.name} 👋</h1>
            <p className="text-indigo-200 text-sm">Here's what's happening at the mall today.</p>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {statCards.map((card, i) => (
          <StatCard key={card.title} {...card} index={i} />
        ))}
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        {/* Inventory Overview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-2xl p-6 border ${isDark ? 'bg-slate-800 border-slate-700/50' : 'bg-white border-slate-100'}`}
          style={{ boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.06)' }}
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
              <TrendingUp size={16} className="text-white" />
            </div>
            <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-700'}`}>Inventory Overview</h3>
          </div>
          <div className="space-y-4">
            {[
              { label: 'In Stock', value: inventoryOverview?.in_stock, color: 'from-emerald-500 to-teal-500' },
              { label: 'Low Stock', value: inventoryOverview?.low_stock, color: 'from-amber-500 to-orange-500' },
              { label: 'Out of Stock', value: inventoryOverview?.out_of_stock, color: 'from-rose-500 to-pink-500' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${color}`} />
                  <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
                </div>
                <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{value ?? '—'}</span>
              </div>
            ))}
            <div className={`flex items-center justify-between pt-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
              <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Total Units</span>
              <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{inventoryOverview?.total_stock ?? '—'}</span>
            </div>
          </div>
        </motion.div>

        {/* Recent Employees */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`xl:col-span-2 rounded-2xl p-6 border ${isDark ? 'bg-slate-800 border-slate-700/50' : 'bg-white border-slate-100'}`}
          style={{ boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.06)' }}
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <Users size={16} className="text-white" />
            </div>
            <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-700'}`}>Recent Employees</h3>
          </div>
          <div className="space-y-3">
            {recentActivity?.recentEmployees?.length ? (
              recentActivity.recentEmployees.map((emp, i) => (
                <motion.div
                  key={emp.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                      {emp.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-700'}`}>{emp.name}</p>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>{emp.department ?? 'No department'}</p>
                    </div>
                  </div>
                  <Badge label={emp.role} color={roleColor[emp.role]} />
                </motion.div>
              ))
            ) : (
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>No employees yet</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Outlets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`rounded-2xl p-6 border mb-6 ${isDark ? 'bg-slate-800 border-slate-700/50' : 'bg-white border-slate-100'}`}
        style={{ boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.06)' }}
      >
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <Store size={16} className="text-white" />
          </div>
          <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-700'}`}>Recently Added Outlets</h3>
        </div>
        <div className={`divide-y ${isDark ? 'divide-slate-700/50' : 'divide-slate-50'}`}>
          {recentActivity?.recentOutlets?.length ? (
            recentActivity.recentOutlets.map((outlet, i) => (
              <motion.div
                key={outlet.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                    <Store size={16} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-700'}`}>{outlet.name}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>{outlet.brand_name} · Floor {outlet.floor} · {outlet.shop_number}</p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>No outlets yet</p>
          )}
        </div>
      </motion.div>

      {/* AI Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white rounded-full opacity-5" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white rounded-full opacity-5" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <h3 className="text-sm font-semibold text-white">AI Smart Summary</h3>
          </div>
          {aiLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-indigo-200">Analyzing mall data...</span>
            </div>
          ) : (
            <p className="text-sm text-indigo-100 leading-relaxed">{aiSummary ?? 'No summary available'}</p>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard