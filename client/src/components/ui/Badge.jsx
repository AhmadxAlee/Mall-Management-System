const gradients = {
  slate: 'from-slate-500 to-slate-600',
  indigo: 'from-indigo-500 to-purple-600',
  emerald: 'from-emerald-500 to-teal-600',
  amber: 'from-amber-500 to-orange-600',
  rose: 'from-rose-500 to-pink-600',
  sky: 'from-sky-500 to-blue-600',
  violet: 'from-violet-500 to-purple-600',
}

const Badge = ({ label, color = 'slate' }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold text-white bg-gradient-to-r ${gradients[color]}`}>
      {label}
    </span>
  )
}

export default Badge