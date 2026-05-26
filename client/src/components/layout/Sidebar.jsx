import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, Tag, Store,
  UtensilsCrossed, Package, LogOut,
  ShoppingBag, Sun, Moon, Menu, X,
} from 'lucide-react'
import { logout } from '../../features/auth/authSlice'
import { useTheme } from '../../utils/ThemeContext'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', gradient: 'from-indigo-500 to-purple-500' },
  { to: '/employees', icon: Users, label: 'Employees', gradient: 'from-blue-500 to-cyan-500' },
  { to: '/brands', icon: Tag, label: 'Brands', gradient: 'from-violet-500 to-purple-500' },
  { to: '/outlets', icon: Store, label: 'Outlets', gradient: 'from-sky-500 to-blue-500' },
  { to: '/foodcourt', icon: UtensilsCrossed, label: 'Food Court', gradient: 'from-emerald-500 to-teal-500' },
  { to: '/products', icon: Package, label: 'Products', gradient: 'from-amber-500 to-orange-500' },
]

const SidebarContent = ({ onClose }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { isDark, toggleTheme } = useTheme()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className={`flex flex-col h-full ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
      <div className={`px-6 py-5 border-b flex items-center justify-between ${isDark ? 'border-slate-700/50' : 'border-slate-100'}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <ShoppingBag size={18} className="text-white" />
          </div>
          <div>
            <h1 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>MallOS</h1>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Management System</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className={`p-1.5 rounded-lg ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100'}`}>
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, gradient }, i) => (
          <motion.div key={to} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
            <NavLink
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${isActive
                  ? isDark ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'
                  : isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isActive ? `bg-gradient-to-r ${gradient}` : isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                    <Icon size={16} className={isActive ? 'text-white' : isDark ? 'text-slate-400' : 'text-slate-500'} />
                  </div>
                  <span className="font-medium">{label}</span>
                  {isActive && <motion.div layoutId="activeIndicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      <div className={`px-3 py-4 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-100'}`}>
        <button onClick={toggleTheme} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm w-full mb-2 transition-all ${isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
            {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-500" />}
          </div>
          <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <div className={`flex items-center gap-3 px-3 py-2 mb-1 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{user?.name}</p>
            <p className={`text-xs capitalize ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{user?.role}</p>
          </div>
        </div>

        <button onClick={handleLogout} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm w-full transition-all ${isDark ? 'text-slate-400 hover:bg-rose-500/10 hover:text-rose-400' : 'text-slate-500 hover:bg-rose-50 hover:text-rose-500'}`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
            <LogOut size={16} />
          </div>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}

const Sidebar = () => {
  const { isDark } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col z-50 border-r ${isDark ? 'bg-slate-900 border-slate-700/50' : 'bg-white border-slate-100'}`}>
        <SidebarContent />
      </aside>

      {/* Mobile Top Bar */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 border-b ${isDark ? 'bg-slate-900 border-slate-700/50' : 'bg-white border-slate-100'}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <ShoppingBag size={16} className="text-white" />
          </div>
          <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>MallOS</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className={`p-2 rounded-xl ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 h-full w-72 z-50"
            >
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar