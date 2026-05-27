import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Package, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../features/products/productSlice'
import { fetchOutlets } from '../features/outlets/outletSlice'
import Table from '../components/ui/Table'
import SearchBar from '../components/ui/SearchBar'
import Pagination from '../components/ui/Pagination'
import Modal from '../components/ui/Modal'

const emptyForm = { outlet_id: '', name: '', description: '', price: '', category: '', sku: '', quantity: '', min_stock_level: '' }
const inputClass = "w-full px-3 py-2.5 text-sm rounded-xl text-white placeholder-pink-300/50 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
const inputStyle = { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }

const Products = () => {
  const dispatch = useDispatch()
  const { products, total, page, limit, loading } = useSelector((state) => state.products)
  const { outlets } = useSelector((state) => state.outlets)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    dispatch(fetchProducts({ search, page: currentPage, limit: 10 }))
    dispatch(fetchOutlets({ limit: 100 }))
  }, [dispatch, search, currentPage])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (product) => {
    setEditing(product)
    setForm({ outlet_id: product.outlet_id || '', name: product.name, description: product.description || '', price: product.price, category: product.category || '', sku: product.sku || '', quantity: product.quantity || '', min_stock_level: product.min_stock_level || '' })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form, price: Number(form.price), quantity: form.quantity ? Number(form.quantity) : 0, min_stock_level: form.min_stock_level ? Number(form.min_stock_level) : 10 }
    if (editing) {
      const res = await dispatch(updateProduct({ id: editing.id, ...payload }))
      if (res.meta.requestStatus === 'fulfilled') { toast.success('Product updated'); setModalOpen(false) }
      else toast.error(res.payload)
    } else {
      const res = await dispatch(createProduct(payload))
      if (res.meta.requestStatus === 'fulfilled') { toast.success('Product created'); setModalOpen(false) }
      else toast.error(res.payload)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    const res = await dispatch(deleteProduct(id))
    if (res.meta.requestStatus === 'fulfilled') toast.success('Product deleted')
    else toast.error(res.payload)
  }

  const columns = [
    {
      key: 'name', label: 'Product',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #fa709a, #fee140)' }}>
            {row.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-white">{row.name}</p>
            <p className="text-xs text-pink-300">{row.sku || 'No SKU'}</p>
          </div>
        </div>
      ),
    },
    { key: 'category', label: 'Category' },
    { key: 'outlet_name', label: 'Outlet' },
    { key: 'price', label: 'Price', render: (row) => `PKR ${Number(row.price).toLocaleString()}` },
    {
      key: 'quantity', label: 'Stock',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className={`font-semibold ${row.quantity <= row.min_stock_level ? 'text-rose-400' : 'text-white'}`}>{row.quantity}</span>
          {row.quantity <= row.min_stock_level && <AlertTriangle size={14} className="text-rose-400" />}
        </div>
      ),
    },
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
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fa709a, #fee140)' }}>
            <Package size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Products</h1>
            <p className="text-sm text-pink-300">{total} total products</p>
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #f472b6, #fb923c)' }}>
          <Plus size={16} /> Add Product
        </motion.button>
      </motion.div>

      <div className="mb-4 max-w-sm">
        <SearchBar value={search} onChange={(val) => { setSearch(val); setCurrentPage(1) }} placeholder="Search products..." />
      </div>

      <Table columns={columns} data={products} loading={loading} emptyMessage="No products found" />
      <Pagination page={currentPage} limit={limit} total={total} onPageChange={setCurrentPage} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Product' : 'Add Product'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-pink-200 mb-1">Outlet</label>
            <select value={form.outlet_id} onChange={(e) => setForm({ ...form, outlet_id: e.target.value })} className={inputClass} style={inputStyle}>
              <option value="" style={{ background: '#1a0533' }}>Select an outlet</option>
              {outlets.map((o) => <option key={o.id} value={o.id} style={{ background: '#1a0533' }}>{o.name}</option>)}
            </select>
          </div>
          {[
            { label: 'Product Name', key: 'name', type: 'text', required: true },
            { label: 'Category', key: 'category', type: 'text' },
            { label: 'SKU', key: 'sku', type: 'text' },
            { label: 'Price (PKR)', key: 'price', type: 'number', required: true },
            { label: 'Stock Quantity', key: 'quantity', type: 'number' },
            { label: 'Min Stock Level', key: 'min_stock_level', type: 'number' },
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

export default Products