import { motion } from 'framer-motion'
import { useTheme } from '../../utils/ThemeContext'

const Table = ({ columns, data, loading, emptyMessage = 'No data found' }) => {
  const { isDark } = useTheme()

  if (loading) {
    return (
      <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700/50' : 'bg-white border-slate-100'}`}>
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Loading data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700/50' : 'bg-white border-slate-100'}`}
      style={{ boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.06)' }}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDark ? 'bg-slate-700/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
              {columns.map((col) => (
                <th key={col.key} className={`text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-slate-700/50' : 'divide-slate-50'}`}>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-16">
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                      <span className="text-2xl">📭</span>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <motion.tr
                  key={row.id || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`transition-colors ${isDark ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50/80'}`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-5 py-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {col.render ? col.render(row) : row[col.key] ?? '—'}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Table