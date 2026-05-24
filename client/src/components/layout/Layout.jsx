import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main style={{ marginLeft: '256px', width: 'calc(100% - 256px)' }} className="p-8 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout