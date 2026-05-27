import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Store } from 'lucide-react'
import toast from 'react-hot-toast'
import { fetchOutlets, createOutlet, updateOutlet, deleteOutlet } from '../features/outlets/outletSlice'
import { fetchBrands } from '../features/brands/brandSlice'
import Table from '../components/ui/Table'
import SearchBar from '../components/ui/SearchBar'
import Pagination from '../components/ui/Pagination'
import Modal from '../components/ui/Modal'

const emptyForm = { brand_id: '', name: '', floor: '', shop_number: '', contact_number: '' }
const iClass = "w-full px-3 py-2.5 text-sm rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 transition-all"
const iStyle = { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' }

const Outlets = () => {
  const dispatch = useDispatch()
  const { outlets, total, page, limit, loading } = useSelector((state) => state.outlets)
  const { brands } = useSelector((state) => state.brands)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    dispatch(fetchOutlets({ search, page: currentPage, limit: 10 }))
    dispatch(fetchBrands({ limit: 100 }))
  }, [dispatch, search, currentPage])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (outlet) => {
    setEditing(outlet)
    setForm({ brand_id: outlet.brand_id, name: outlet.name, floor: outlet.floor || '', shop_number: outlet.shop_number || '', contact_number: outlet.contact_number || '' })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const action = editing ? updateOutlet({ id: editing.id, ...form }) : createOutlet(form)
    const res = await dispatch(action)
    if (res.meta.requestStatus === 'fulfilled') { toast.success(editing ? 'Outlet updated' : 'Outlet created'); setModalOpen(false) }
    else toast.error(res.payload)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this outlet?')) return
    const res = await dispatch(deleteOutlet(id))
    if (res.meta.requestStatus === 'fulfilled') toast.success('Outlet deleted')
    else toast.error(res.payload)
  }

  const columns = [
    {
      key: 'name', label: 'Outlet',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: '#c026d3' }}>{row.name.charAt(0)}</div>
          <span className="font-medium text-white">{row.name}</span>
        </div>
      ),
    },
    { key: 'brand_name', label: 'Brand' },
    { key: 'floor', label: 'Floor' },
    { key: 'shop_number', label: 'Shop No.' },
    { key: 'contact_number', label: 'Contact' },
    {
      key: 'actions', label: '',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg text-white/40 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}><Pencil size={14} /></button>
          <button onClick={() => handleDelete(row.id)} className="p-1.5 rounded-lg text-white/40 hover:text-red-400 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}><Trash2 size={14} /></button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#c026d3' }}>
            <Store size={19} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Outlets</h1>
            <p className="text-sm text-white/40">{total} total</p>
          </div>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity" style={{ background: '#c026d3' }}>
          <Plus size={15} /> Add Outlet
        </button>
      </motion.div>
      <div className="mb-4 max-w-sm">
        <SearchBar value={search} onChange={(val) => { setSearch(val); setCurrentPage(1) }} placeholder="Search outlets..." />
      </div>
      <Table columns={columns} data={outlets} loading={loading} emptyMessage="No outlets found" />
      <Pagination page={currentPage} limit={limit} total={total} onPageChange={setCurrentPage} />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Outlet' : 'Add Outlet'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1">Brand</label>
            <select value={form.brand_id} onChange={(e) => setForm({ ...form, brand_id: e.target.value })} required className={iClass} style={iStyle}>
              <option value="" style={{ background: '#1a0a2e' }}>Select a brand</option>
              {brands.map((b) => <option key={b.id} value={b.id} style={{ background: '#1a0a2e' }}>{b.name}</option>)}
            </select>
          </div>
          {[
            { label: 'Outlet Name', key: 'name', type: 'text', required: true },
            { label: 'Floor', key: 'floor', type: 'text' },
            { label: 'Shop Number', key: 'shop_number', type: 'text' },
            { label: 'Contact Number', key: 'contact_number', type: 'text' },
          ].map(({ label, key, type, required }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-white/50 mb-1">{label}</label>
              <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required={required} className={iClass} style={iStyle} />
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 text-sm rounded-xl text-white/50 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 text-sm rounded-xl text-white font-medium" style={{ background: '#c026d3' }}>{editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Outlets