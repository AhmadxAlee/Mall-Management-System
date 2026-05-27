import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, Tag, Store,
  UtensilsCrossed, Package, LogOut,
  ShoppingBag, Menu, X,
} from 'lucide-react'
import { logout } from '../../features/auth/authSlice'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/employees', icon: Users, label: 'Employees' },
  { to: '/brands', icon: Tag, label: 'Brands' },
  { to: '/outlets', icon: Store, label: 'Outlets' },
  { to: '/foodcourt', icon: UtensilsCrossed, label: 'Food Court' },
  { to: '/products', icon: Package, label: 'Products' },
]

const SidebarContent = ({ onClose }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="flex flex-col h-full" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center pulse-glow" style={{ background: 'linear-gradient(135deg, #f472b6, #fb923c)' }}>
            <ShoppingBag size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-white">MallOS</h1>
            <p className="text-xs text-pink-300">Management System</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-pink-300 hover:text-white p-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }, i) => (
          <motion.div key={to} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
            <NavLink
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'text-pink-300/70 hover:text-white hover:bg-white/5'
                }`
              }
              style={({ isActive }) => isActive ? { background: 'linear-gradient(135deg, rgba(244,114,182,0.2), rgba(251,146,60,0.2))', border: '1px solid rgba(244,114,182,0.3)' } : {}}
            >
              {({ isActive }) => (
                <>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                    style={{ background: isActive ? 'linear-gradient(135deg, #f472b6, #fb923c)' : 'rgba(255,255,255,0.05)' }}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <span className="font-medium">{label}</span>
                  {isActive && <motion.div layoutId="activeIndicator" className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#f472b6' }} />}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #f472b6, #fb923c)' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-pink-300 capitalize">{user?.role}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm w-full transition-all text-pink-300/70 hover:text-white"
          style={{ ':hover': { background: 'rgba(244,114,182,0.1)' } }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <LogOut size={16} />
          </div>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col z-50">
        <SidebarContent />
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f472b6, #fb923c)' }}>
            <ShoppingBag size={16} className="text-white" />
          </div>
          <span className="font-bold text-sm text-white">MallOS</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-xl text-pink-300 hover:text-white" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <Menu size={20} />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 z-50"
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