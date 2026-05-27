const gradients = {
  slate: 'linear-gradient(135deg, #475569, #64748b)',
  indigo: 'linear-gradient(135deg, #667eea, #764ba2)',
  emerald: 'linear-gradient(135deg, #43e97b, #38f9d7)',
  amber: 'linear-gradient(135deg, #f093fb, #f5576c)',
  rose: 'linear-gradient(135deg, #fa709a, #fee140)',
  sky: 'linear-gradient(135deg, #4facfe, #00f2fe)',
  violet: 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
}

const Badge = ({ label, color = 'slate' }) => {
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold text-white"
      style={{ background: gradients[color] }}
    >
      {label}
    </span>
  )
}

export default Badge