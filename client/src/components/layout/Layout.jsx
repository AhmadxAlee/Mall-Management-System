import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import { useTheme } from '../../utils/ThemeContext'

const Layout = () => {
  const { isDark } = useTheme()

  return (
    <div className={`flex min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <Sidebar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 p-4 lg:p-8 overflow-x-hidden pt-16 lg:pt-8"
        style={{ marginLeft: '0', paddingLeft: '1rem' }}
      >
        <div className="lg:ml-64">
          <Outlet />
        </div>
      </motion.main>
    </div>
  )
}

export default Layout