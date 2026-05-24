import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  fetchBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../features/brands/brandSlice'
import Table from '../components/ui/Table'
import SearchBar from '../components/ui/SearchBar'
import Pagination from '../components/ui/Pagination'
import Modal from '../components/ui/Modal'

const emptyForm = { name: '', description: '', category: '', logo_url: '' }

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

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (brand) => {
    setEditing(brand)
    setForm({
      name: brand.name,
      description: brand.description || '',
      category: brand.category || '',
      logo_url: brand.logo_url || '',
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) {
      const res = await dispatch(updateBrand({ id: editing.id, ...form }))
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('Brand updated')
        setModalOpen(false)
      } else {
        toast.error(res.payload)
      }
    } else {
      const res = await dispatch(createBrand(form))
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('Brand created')
        setModalOpen(false)
      } else {
        toast.error(res.payload)
      }
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this brand?')) return
    const res = await dispatch(deleteBrand(id))
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Brand deleted')
    } else {
      toast.error(res.payload)
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Brand',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.logo_url ? (
            <img src={row.logo_url} alt={row.name} className="w-8 h-8 object-contain rounded" />
          ) : (
            <div className="w-8 h-8 bg-indigo-100 rounded flex items-center justify-center text-indigo-600 text-xs font-bold">
              {row.name.charAt(0)}
            </div>
          )}
          <span className="font-medium text-slate-700">{row.name}</span>
        </div>
      ),
    },
    { key: 'category', label: 'Category' },
    { key: 'description', label: 'Description' },
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
          <h1 className="text-2xl font-bold text-slate-800">Brands</h1>
          <p className="text-slate-500 text-sm mt-1">{total} total brands</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} />
          Add Brand
        </button>
      </div>

      <div className="mb-4 max-w-sm">
        <SearchBar
          value={search}
          onChange={(val) => { setSearch(val); setCurrentPage(1) }}
          placeholder="Search brands..."
        />
      </div>

      <Table columns={columns} data={brands} loading={loading} emptyMessage="No brands found" />
      <Pagination page={currentPage} limit={limit} total={total} onPageChange={setCurrentPage} />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Brand' : 'Add Brand'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Brand Name', key: 'name', type: 'text', required: true },
            { label: 'Category', key: 'category', type: 'text' },
            { label: 'Logo URL', key: 'logo_url', type: 'text' },
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

export default Brands