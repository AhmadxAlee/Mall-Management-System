import { useTheme } from '../../utils/ThemeContext'

const Pagination = ({ page, limit, total, onPageChange }) => {
  const totalPages = Math.ceil(total / limit)
  const { isDark } = useTheme()

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between mt-4">
      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} results
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={`px-3 py-1.5 text-sm rounded-xl border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1.5 text-sm rounded-xl border transition-colors ${
              p === page
                ? 'text-white border-transparent'
                : isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            style={p === page ? { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' } : {}}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className={`px-3 py-1.5 text-sm rounded-xl border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Pagination