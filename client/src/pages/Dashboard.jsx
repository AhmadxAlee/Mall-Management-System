import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Users, Tag, Store, UtensilsCrossed, Package, AlertTriangle, Sparkles, TrendingUp } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend
} from 'recharts'
import {
  fetchStats, fetchRecentActivity, fetchInventoryOverview,
  fetchAISummary, fetchEmployeeStats
} from '../features/dashboard/dashboardSlice'
import StatCard from '../components/ui/StatCard'
import Badge from '../components/ui/Badge'

const COLORS = ['#f472b6', '#fb923c', '#a78bfa', '#4facfe', '#43e97b', '#fee140']

const Dashboard = () => {
  const dispatch = useDispatch()
  const { stats, recentActivity, inventoryOverview, aiSummary, aiLoading, employeeStats } = useSelector((state) => state.dashboard)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchStats())
    dispatch(fetchRecentActivity())
    dispatch(fetchInventoryOverview())
    dispatch(fetchAISummary())
    dispatch(fetchEmployeeStats())
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

  const deptData = employeeStats.reduce((acc, curr) => {
    const existing = acc.find(d => d.department === curr.department)
    if (existing) existing.count += parseInt(curr.count)
    else acc.push({ department: curr.department, count: parseInt(curr.count) })
    return acc
  }, [])

  const pieData = [
    { name: 'In Stock', value: parseInt(inventoryOverview?.in_stock) || 0 },
    { name: 'Low Stock', value: parseInt(inventoryOverview?.low_stock) || 0 },
    { name: 'Out of Stock', value: parseInt(inventoryOverview?.out_of_stock) || 0 },
  ].filter(d => d.value > 0)

  const glassCard = {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
  }

  const tooltipStyle = {
    background: 'rgba(26,5,51,0.95)',
    border: '1px solid rgba(244,114,182,0.3)',
    borderRadius: '12px',
    color: '#fff',
  }

  return (
    <div className="w-full">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(244,114,182,0.3), rgba(251,146,60,0.3))', border: '1px solid rgba(244,114,182,0.3)' }}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full" style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.2), transparent)' }} />
          </div>
          <div className="relative z-10">
            <p className="text-pink-300 text-sm font-medium mb-1">{getGreeting()}</p>
            <h1 className="text-white text-2xl font-bold mb-1">{user?.name} 👋</h1>
            <p className="text-pink-200 text-sm">Here's what's happening at the mall today.</p>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {statCards.map((card, i) => <StatCard key={card.title} {...card} index={i} />)}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl p-6" style={glassCard}>
          <h3 className="text-sm font-semibold text-white mb-4">Employees by Department</h3>
          {deptData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deptData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="department" tick={{ fontSize: 11, fill: '#f9a8d4' }} />
                <YAxis tick={{ fontSize: 11, fill: '#f9a8d4' }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {deptData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-52">
              <p className="text-sm text-pink-300">No employee data yet</p>
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl p-6" style={glassCard}>
          <h3 className="text-sm font-semibold text-white mb-4">Inventory Status</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={['#f472b6', '#fb923c', '#a78bfa'][index]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend formatter={(value) => <span style={{ color: '#f9a8d4', fontSize: '12px' }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-52">
              <p className="text-sm text-pink-300">No inventory data yet</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl p-6" style={glassCard}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #43e97b, #38f9d7)' }}>
              <TrendingUp size={16} className="text-white" />
            </div>
            <h3 className="text-sm font-semibold text-white">Inventory Overview</h3>
          </div>
          <div className="space-y-4">
            {[
              { label: 'In Stock', value: inventoryOverview?.in_stock, color: '#43e97b' },
              { label: 'Low Stock', value: inventoryOverview?.low_stock, color: '#fb923c' },
              { label: 'Out of Stock', value: inventoryOverview?.out_of_stock, color: '#f472b6' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className="text-sm text-pink-200">{label}</span>
                </div>
                <span className="text-sm font-bold text-white">{value ?? '—'}</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="text-sm text-pink-200">Total Units</span>
              <span className="text-lg font-bold text-white">{inventoryOverview?.total_stock ?? '—'}</span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="xl:col-span-2 rounded-2xl p-6" style={glassCard}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f472b6, #fb923c)' }}>
              <Users size={16} className="text-white" />
            </div>
            <h3 className="text-sm font-semibold text-white">Recent Employees</h3>
          </div>
          <div className="space-y-3">
            {recentActivity?.recentEmployees?.length ? (
              recentActivity.recentEmployees.map((emp, i) => (
                <motion.div key={emp.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}
                  className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #f472b6, #fb923c)' }}>
                      {emp.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{emp.name}</p>
                      <p className="text-xs text-pink-300">{emp.department ?? 'No department'}</p>
                    </div>
                  </div>
                  <Badge label={emp.role} color={roleColor[emp.role]} />
                </motion.div>
              ))
            ) : (
              <p className="text-sm text-pink-300">No employees yet</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Outlets */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-2xl p-6 mb-6" style={glassCard}>
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)' }}>
            <Store size={16} className="text-white" />
          </div>
          <h3 className="text-sm font-semibold text-white">Recently Added Outlets</h3>
        </div>
        <div>
          {recentActivity?.recentOutlets?.length ? (
            recentActivity.recentOutlets.map((outlet, i) => (
              <motion.div key={outlet.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 * i }}
                className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <Store size={16} className="text-pink-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{outlet.name}</p>
                    <p className="text-xs text-pink-300">{outlet.brand_name} · Floor {outlet.floor} · {outlet.shop_number}</p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-sm text-pink-300">No outlets yet</p>
          )}
        </div>
      </motion.div>

      {/* AI Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(244,114,182,0.2), rgba(251,146,60,0.2))', border: '1px solid rgba(244,114,182,0.3)' }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f472b6, #fb923c)' }}>
            <Sparkles size={14} className="text-white" />
          </div>
          <h3 className="text-sm font-semibold text-white">AI Smart Summary</h3>
        </div>
        {aiLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'rgba(244,114,182,0.3)', borderTopColor: '#f472b6' }} />
            <span className="text-sm text-pink-300">Analyzing mall data...</span>
          </div>
        ) : (
          <p className="text-sm text-pink-100 leading-relaxed">{aiSummary ?? 'No summary available'}</p>
        )}
      </motion.div>
    </div>
  )
}

export default Dashboard