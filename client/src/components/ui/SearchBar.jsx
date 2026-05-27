import { Search, X } from 'lucide-react'

const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <div className="relative">
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-300" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-8 py-2.5 text-sm rounded-xl text-white placeholder-pink-300/50 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
      />
      {value && (
        <button onClick={() => onChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-300 hover:text-white">
          <X size={14} />
        </button>
      )}
    </div>
  )
}

export default SearchBar