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
        style={{ marginLeft: '256px', width: 'calc(100% - 256px)' }}
        className="p-8 overflow-x-hidden"
      >
        <Outlet />
      </motion.main>
    </div>
  )
}

export default Layout