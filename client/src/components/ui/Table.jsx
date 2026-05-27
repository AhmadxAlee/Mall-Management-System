import { motion } from 'framer-motion'

const Table = ({ columns, data, loading, emptyMessage = 'No data found' }) => {
  if (loading) {
    return (
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: 'rgba(244,114,182,0.3)', borderTopColor: '#f472b6' }} />
            <p className="text-sm text-pink-300">Loading data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)' }}>
              {columns.map((col) => (
                <th key={col.key} className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-pink-300">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-16">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <span className="text-2xl">📭</span>
                    </div>
                    <p className="text-sm text-pink-300">{emptyMessage}</p>
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
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  className="transition-colors hover:bg-white/5"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-4 text-sm text-white/80">
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