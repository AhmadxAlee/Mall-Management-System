import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../features/products/productSlice'
import { fetchOutlets } from '../features/outlets/outletSlice'
import Table from '../components/ui/Table'
import SearchBar from '../components/ui/SearchBar'
import Pagination from '../components/ui/Pagination'
import Modal from '../components/ui/Modal'
import Badge from '../components/ui/Badge'

const emptyForm = {
  outlet_id: '',
  name: '',
  description: '',
  price: '',
  category: '',
  sku: '',
  quantity: '',
  min_stock_level: '',
}

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

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (product) => {
    setEditing(product)
    setForm({
      outlet_id: product.outlet_id || '',
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category || '',
      sku: product.sku || '',
      quantity: product.quantity || '',
      min_stock_level: product.min_stock_level || '',
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      price: Number(form.price),
      quantity: form.quantity ? Number(form.quantity) : 0,
      min_stock_level: form.min_stock_level ? Number(form.min_stock_level) : 10,
    }

    if (editing) {
      const res = await dispatch(updateProduct({ id: editing.id, ...payload }))
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('Product updated')
        setModalOpen(false)
      } else {
        toast.error(res.payload)
      }
    } else {
      const res = await dispatch(createProduct(payload))
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('Product created')
        setModalOpen(false)
      } else {
        toast.error(res.payload)
      }
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    const res = await dispatch(deleteProduct(id))
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Product deleted')
    } else {
      toast.error(res.payload)
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Product',
      render: (row) => (
        <div>
          <p className="font-medium text-slate-700">{row.name}</p>
          <p className="text-xs text-slate-400">{row.sku || 'No SKU'}</p>
        </div>
      ),
    },
    { key: 'category', label: 'Category' },
    { key: 'outlet_name', label: 'Outlet' },
    {
      key: 'price',
      label: 'Price',
      render: (row) => `PKR ${Number(row.price).toLocaleString()}`,
    },
    {
      key: 'quantity',
      label: 'Stock',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className={row.quantity <= row.min_stock_level ? 'text-rose-600 font-semibold' : 'text-slate-700'}>
            {row.quantity}
          </span>
          {row.quantity <= row.min_stock_level && (
            <AlertTriangle size={14} className="text-rose-500" />
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEdit(row)}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Products</h1>
          <p className="text-slate-500 text-sm mt-1">{total} total products</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      <div className="mb-4 max-w-sm">
        <SearchBar
          value={search}
          onChange={(val) => { setSearch(val); setCurrentPage(1) }}
          placeholder="Search products..."
        />
      </div>

      <Table columns={columns} data={products} loading={loading} emptyMessage="No products found" />
      <Pagination page={currentPage} limit={limit} total={total} onPageChange={setCurrentPage} />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Product' : 'Add Product'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Outlet</label>
            <select
              value={form.outlet_id}
              onChange={(e) => setForm({ ...form, outlet_id: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select an outlet</option>
              {outlets.map((o) => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
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
              <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                required={required}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Products