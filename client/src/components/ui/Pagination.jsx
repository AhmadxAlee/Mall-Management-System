const Pagination = ({ page, limit, total, onPageChange }) => {
  const totalPages = Math.ceil(total / limit)
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm text-white/40">
        Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} results
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1.5 text-sm rounded-xl text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className="px-3 py-1.5 text-sm rounded-xl text-white transition-colors"
            style={p === page
              ? { background: '#c026d3', border: '1px solid transparent' }
              : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }
            }
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1.5 text-sm rounded-xl text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Pagination