import { Search, X } from 'lucide-react'
import { useTheme } from '../../utils/ThemeContext'

const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => {
  const { isDark } = useTheme()

  return (
    <div className="relative">
      <Search size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-10 pr-8 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'}`}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}

export default SearchBar