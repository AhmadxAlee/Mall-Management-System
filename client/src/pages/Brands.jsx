import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Tag } from 'lucide-react'
import toast from 'react-hot-toast'
import { fetchBrands, createBrand, updateBrand, deleteBrand } from '../features/brands/brandSlice'
import Table from '../components/ui/Table'
import SearchBar from '../components/ui/SearchBar'
import Pagination from '../components/ui/Pagination'
import Modal from '../components/ui/Modal'

const emptyForm = { name: '', description: '', category: '', logo_url: '' }
const inputClass = "w-full px-3 py-2.5 text-sm rounded-xl text-white placeholder-pink-300/50 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
const inputStyle = { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }

const Brands = () => {
  const dispatch = useDispatch()
  const { brands, total, page, limit, loading } = useSelector((state) => state.brands)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    dispatch(fetchBrands({ search, page: currentPage, limit: 10 }))
  }, [dispatch, search, currentPage])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (brand) => {
    setEditing(brand)
    setForm({ name: brand.name, description: brand.description || '', category: brand.category || '', logo_url: brand.logo_url || '' })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) {
      const res = await dispatch(updateBrand({ id: editing.id, ...form }))
      if (res.meta.requestStatus === 'fulfilled') { toast.success('Brand updated'); setModalOpen(false) }
      else toast.error(res.payload)
    } else {
      const res = await dispatch(createBrand(form))
      if (res.meta.requestStatus === 'fulfilled') { toast.success('Brand created'); setModalOpen(false) }
      else toast.error(res.payload)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this brand?')) return
    const res = await dispatch(deleteBrand(id))
    if (res.meta.requestStatus === 'fulfilled') toast.success('Brand deleted')
    else toast.error(res.payload)
  }

  const columns = [
    {
      key: 'name', label: 'Brand',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.logo_url ? (
            <img src={row.logo_url} alt={row.name} className="w-9 h-9 object-contain rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.1)' }} />
          ) : (
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #a18cd1, #fbc2eb)' }}>
              {row.name.charAt(0)}
            </div>
          )}
          <span className="font-medium text-white">{row.name}</span>
        </div>
      ),
    },
    { key: 'category', label: 'Category' },
    { key: 'description', label: 'Description' },
    {
      key: 'actions', label: '',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg text-pink-300 hover:text-white transition-colors" style={{ background: 'rgba(244,114,182,0.1)' }}><Pencil size={15} /></button>
          <button onClick={() => handleDelete(row.id)} className="p-1.5 rounded-lg text-pink-300 hover:text-white transition-colors" style={{ background: 'rgba(244,114,182,0.1)' }}><Trash2 size={15} /></button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #a18cd1, #fbc2eb)' }}>
            <Tag size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Brands</h1>
            <p className="text-sm text-pink-300">{total} total brands</p>
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #f472b6, #fb923c)' }}>
          <Plus size={16} /> Add Brand
        </motion.button>
      </motion.div>

      <div className="mb-4 max-w-sm">
        <SearchBar value={search} onChange={(val) => { setSearch(val); setCurrentPage(1) }} placeholder="Search brands..." />
      </div>

      <Table columns={columns} data={brands} loading={loading} emptyMessage="No brands found" />
      <Pagination page={currentPage} limit={limit} total={total} onPageChange={setCurrentPage} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Brand' : 'Add Brand'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Brand Name', key: 'name', type: 'text', required: true },
            { label: 'Category', key: 'category', type: 'text' },
            { label: 'Logo URL', key: 'logo_url', type: 'text' },
          ].map(({ label, key, type, required }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-pink-200 mb-1">{label}</label>
              <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required={required} className={inputClass} style={inputStyle} />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-pink-200 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={`${inputClass} resize-none`} style={inputStyle} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 text-sm rounded-xl text-pink-300 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 text-sm rounded-xl text-white font-medium" style={{ background: 'linear-gradient(135deg, #f472b6, #fb923c)' }}>{editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Brands