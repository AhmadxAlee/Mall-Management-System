import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Users, Tag, Store, UtensilsCrossed, Package, AlertTriangle } from 'lucide-react'
import { fetchStats, fetchRecentActivity, fetchInventoryOverview, fetchAISummary } from '../features/dashboard/dashboardSlice'
import StatCard from '../components/ui/StatCard'
import Badge from '../components/ui/Badge'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { stats, recentActivity, inventoryOverview, aiSummary, aiLoading } = useSelector((state) => state.dashboard)
  const { user } = useSelector((state) => state.auth)

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

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Good morning, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">Here's what's happening at the mall today.</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Inventory Overview</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">In Stock</span>
              <span className="text-sm font-semibold text-emerald-600">{inventoryOverview?.in_stock ?? '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Low Stock</span>
              <span className="text-sm font-semibold text-amber-600">{inventoryOverview?.low_stock ?? '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Out of Stock</span>
              <span className="text-sm font-semibold text-rose-600">{inventoryOverview?.out_of_stock ?? '—'}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-sm text-slate-500">Total Units</span>
              <span className="text-sm font-bold text-slate-800">{inventoryOverview?.total_stock ?? '—'}</span>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Recent Employees</h3>
          <div className="space-y-3">
            {recentActivity?.recentEmployees?.length ? (
              recentActivity.recentEmployees.map((emp) => (
                <div key={emp.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xs font-bold">
                      {emp.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">{emp.name}</p>
                      <p className="text-xs text-slate-400">{emp.department ?? 'No department'}</p>
                    </div>
                  </div>
                  <Badge label={emp.role} color={roleColor[emp.role]} />
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No employees yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 mb-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Recently Added Outlets</h3>
        <div className="divide-y divide-slate-50">
          {recentActivity?.recentOutlets?.length ? (
            recentActivity.recentOutlets.map((outlet) => (
              <div key={outlet.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">{outlet.name}</p>
                  <p className="text-xs text-slate-400">{outlet.brand_name} · Floor {outlet.floor} · {outlet.shop_number}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400">No outlets yet</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-700">AI Smart Summary</h3>
        </div>
        {aiLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-slate-400">Analyzing mall data...</span>
          </div>
        ) : (
          <p className="text-sm text-slate-600 leading-relaxed">{aiSummary ?? 'No summary available'}</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard