const Pagination = ({ page, limit, total, onPageChange }) => {
  const totalPages = Math.ceil(total / limit)

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm text-pink-300">
        Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} results
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1.5 text-sm rounded-xl text-pink-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className="px-3 py-1.5 text-sm rounded-xl transition-colors text-white"
            style={p === page
              ? { background: 'linear-gradient(135deg, #f472b6, #fb923c)', border: '1px solid transparent' }
              : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }
            }
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1.5 text-sm rounded-xl text-pink-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Pagination