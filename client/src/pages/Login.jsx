import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ShoppingBag, Sparkles } from 'lucide-react'
import { login, clearError } from '../features/auth/authSlice'
import StarBackground from '../components/ui/StarBackground'
import toast from 'react-hot-toast'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, token } = useSelector((state) => state.auth)

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (token) navigate('/')
    return () => dispatch(clearError())
  }, [token, navigate, dispatch])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(login(form))
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <StarBackground />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center pulse-glow"
            style={{ background: 'linear-gradient(135deg, #f472b6, #fb923c)' }}
          >
            <ShoppingBag size={28} className="text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-sm text-pink-300 flex items-center justify-center gap-1">
            <Sparkles size={14} /> Sign in to MallOS
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-pink-200 mb-1.5">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@mall.com"
                required
                className="w-full px-4 py-3 text-sm rounded-xl text-white placeholder-pink-300/50 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-pink-200 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 text-sm rounded-xl text-white placeholder-pink-300/50 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all pr-10"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-300 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              style={{ background: 'linear-gradient(135deg, #f472b6, #fb923c)' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign in'}
            </motion.button>
          </form>

          <p className="text-center text-sm text-pink-300 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-white font-medium hover:underline">Register</Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login