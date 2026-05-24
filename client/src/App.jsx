import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getMe } from './features/auth/authSlice'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Brands from './pages/Brands'
import Outlets from './pages/Outlets'
import FoodCourt from './pages/FoodCourt'
import Products from './pages/Products'

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth)
  if (!token) return <Navigate to="/login" replace />
  return children
}

const GuestRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth)
  if (token) return <Navigate to="/" replace />
  return children
}

const App = () => {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)

  useEffect(() => {
    if (token) dispatch(getMe())
  }, [token, dispatch])

  return (
    <Routes>
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="brands" element={<Brands />} />
        <Route path="outlets" element={<Outlets />} />
        <Route path="foodcourt" element={<FoodCourt />} />
        <Route path="products" element={<Products />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App