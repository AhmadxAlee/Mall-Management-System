import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Users, Tag, Store, UtensilsCrossed, Package, LogOut, ShoppingBag, Menu, X } from 'lucide-react'
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
    <div className="flex flex-col h-full" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(24px)', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="px-5 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#c026d3' }}>
            <ShoppingBag size={17} className="text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-sm text-white">MallOS</h1>
            <p className="text-xs text-white/40">Management System</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/40 hover:text-white p-1 rounded-lg">
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive ? 'text-white' : 'text-white/40 hover:text-white hover:bg-white/5'
              }`
            }
            style={({ isActive }) => isActive ? { background: 'rgba(192,38,211,0.2)', border: '1px solid rgba(192,38,211,0.3)' } : { border: '1px solid transparent' }}
          >
            {({ isActive }) => (
              <>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: isActive ? '#c026d3' : 'rgba(255,255,255,0.05)' }}>
                  <Icon size={16} className="text-white" />
                </div>
                <span className="font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-3 px-3 py-2.5 mb-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: '#c026d3' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-white/40 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm w-full text-white/40 hover:text-white hover:bg-white/5 transition-all"
          style={{ border: '1px solid transparent' }}
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

      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#c026d3' }}>
            <ShoppingBag size={15} className="text-white" />
          </div>
          <span className="font-semibold text-sm text-white">MallOS</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-xl text-white/40 hover:text-white" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <Menu size={20} />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 bg-black/60 z-50" onClick={() => setMobileOpen(false)} />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="lg:hidden fixed left-0 top-0 h-full w-72 z-50">
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar