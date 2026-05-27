const colors = {
  slate: 'rgba(255,255,255,0.1)',
  indigo: 'rgba(192,38,211,0.3)',
  emerald: 'rgba(16,185,129,0.3)',
  amber: 'rgba(245,158,11,0.3)',
  rose: 'rgba(239,68,68,0.3)',
  sky: 'rgba(14,165,233,0.3)',
  violet: 'rgba(139,92,246,0.3)',
}

const Badge = ({ label, color = 'slate' }) => {
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium text-white"
      style={{ background: colors[color], border: '1px solid rgba(255,255,255,0.1)' }}
    >
      {label}
    </span>
  )
}

export default Badge