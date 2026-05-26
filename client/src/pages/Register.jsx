import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ShoppingBag, Sparkles } from 'lucide-react'
import { register, clearError } from '../features/auth/authSlice'
import { useTheme } from '../utils/ThemeContext'
import toast from 'react-hot-toast'

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, token } = useSelector((state) => state.auth)
  const { isDark } = useTheme()

  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee' })
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
    dispatch(register(form))
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

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
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            <ShoppingBag size={28} className="text-white" />
          </motion.div>
          <h1 className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Create account
          </h1>
          <p className={`text-sm flex items-center justify-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <Sparkles size={14} />
            Join MallOS today
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-2xl p-8 shadow-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700 glass' : 'bg-white border-slate-100'}`}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Ahmad Ali' },
              { label: 'Email address', key: 'email', type: 'email', placeholder: 'ahmad@mall.com' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {label}
                </label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  required
                  className={`w-full px-4 py-3 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                />
              </div>
            ))}

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className={`w-full px-4 py-3 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all pr-10 ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Role
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className={`w-full px-4 py-3 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
              >
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed transition-all mt-2"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create account'}
            </motion.button>
          </form>

          <p className={`text-center text-sm mt-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Register