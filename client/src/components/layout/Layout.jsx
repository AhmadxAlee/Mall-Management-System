import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import StarBackground from '../ui/StarBackground'

const Layout = () => {
  return (
    <div className="flex min-h-screen relative">
      <StarBackground />
      <Sidebar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 p-4 lg:p-8 overflow-x-hidden pt-16 lg:pt-8 relative z-10"
        style={{ marginLeft: '0' }}
      >
        <div className="lg:ml-64">
          <Outlet />
        </div>
      </motion.main>
    </div>
  )
}

export default Layout