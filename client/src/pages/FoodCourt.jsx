import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, UtensilsCrossed } from 'lucide-react'
import toast from 'react-hot-toast'
import { fetchFoodCourts, createFoodCourt, updateFoodCourt, deleteFoodCourt } from '../features/foodcourt/foodCourtSlice'
import Table from '../components/ui/Table'
import SearchBar from '../components/ui/SearchBar'
import Pagination from '../components/ui/Pagination'
import Modal from '../components/ui/Modal'
import { useTheme } from '../utils/ThemeContext'

const emptyForm = { name: '', floor: '', total_stalls: '' }

const FoodCourt = () => {
  const dispatch = useDispatch()
  const { foodCourts, total, page, limit, loading } = useSelector((state) => state.foodCourt)
  const { isDark } = useTheme()

  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    dispatch(fetchFoodCourts({ search, page: currentPage, limit: 10 }))
  }, [dispatch, search, currentPage])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (fc) => {
    setEditing(fc)
    setForm({ name: fc.name, floor: fc.floor || '', total_stalls: fc.total_stalls || '' })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form, total_stalls: form.total_stalls ? Number(form.total_stalls) : undefined }
    if (editing) {
      const res = await dispatch(updateFoodCourt({ id: editing.id, ...payload }))
      if (res.meta.requestStatus === 'fulfilled') { toast.success('Food court updated'); setModalOpen(false) }
      else toast.error(res.payload)
    } else {
      const res = await dispatch(createFoodCourt(payload))
      if (res.meta.requestStatus === 'fulfilled') { toast.success('Food court created'); setModalOpen(false) }
      else toast.error(res.payload)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this food court?')) return
    const res = await dispatch(deleteFoodCourt(id))
    if (res.meta.requestStatus === 'fulfilled') toast.success('Food court deleted')
    else toast.error(res.payload)
  }

  const inputClass = `w-full px-3 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-200 text-slate-800'}`

  const columns = [
    {
      key: 'name', label: 'Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            {row.name.charAt(0)}
          </div>
          <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-700'}`}>{row.name}</span>
        </div>
      ),
    },
    { key: 'floor', label: 'Floor' },
    { key: 'total_stalls', label: 'Total Stalls' },
    {
      key: 'actions', label: '',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(row)} className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:bg-indigo-500/20 hover:text-indigo-400' : 'text-slate-400 hover:bg-indigo-50 hover:text-indigo-600'}`}>
            <Pencil size={15} />
          </button>
          <button onClick={() => handleDelete(row.id)} className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:bg-rose-500/20 hover:text-rose-400' : 'text-slate-400 hover:bg-rose-50 hover:text-rose-600'}`}>
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <UtensilsCrossed size={20} className="text-white" />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Food Court</h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{total} total food courts</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}
        >
          <Plus size={16} /> Add Food Court
        </motion.button>
      </motion.div>

      <div className="mb-4 max-w-sm">
        <SearchBar value={search} onChange={(val) => { setSearch(val); setCurrentPage(1) }} placeholder="Search food courts..." />
      </div>

      <Table columns={columns} data={foodCourts} loading={loading} emptyMessage="No food courts found" />
      <Pagination page={currentPage} limit={limit} total={total} onPageChange={setCurrentPage} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Food Court' : 'Add Food Court'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Name', key: 'name', type: 'text', required: true },
            { label: 'Floor', key: 'floor', type: 'text' },
            { label: 'Total Stalls', key: 'total_stalls', type: 'number' },
          ].map(({ label, key, type, required }) => (
            <div key={key}>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{label}</label>
              <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required={required} className={inputClass} />
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className={`flex-1 px-4 py-2.5 text-sm rounded-xl border transition-colors ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 text-sm rounded-xl text-white font-medium" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>{editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default FoodCourt