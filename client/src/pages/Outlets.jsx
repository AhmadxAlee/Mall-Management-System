import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  fetchOutlets,
  createOutlet,
  updateOutlet,
  deleteOutlet,
} from '../features/outlets/outletSlice'
import { fetchBrands } from '../features/brands/brandSlice'
import Table from '../components/ui/Table'
import SearchBar from '../components/ui/SearchBar'
import Pagination from '../components/ui/Pagination'
import Modal from '../components/ui/Modal'

const emptyForm = {
  brand_id: '',
  name: '',
  floor: '',
  shop_number: '',
  contact_number: '',
}

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

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (outlet) => {
    setEditing(outlet)
    setForm({
      brand_id: outlet.brand_id,
      name: outlet.name,
      floor: outlet.floor || '',
      shop_number: outlet.shop_number || '',
      contact_number: outlet.contact_number || '',
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) {
      const res = await dispatch(updateOutlet({ id: editing.id, ...form }))
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('Outlet updated')
        setModalOpen(false)
      } else {
        toast.error(res.payload)
      }
    } else {
      const res = await dispatch(createOutlet(form))
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('Outlet created')
        setModalOpen(false)
      } else {
        toast.error(res.payload)
      }
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this outlet?')) return
    const res = await dispatch(deleteOutlet(id))
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Outlet deleted')
    } else {
      toast.error(res.payload)
    }
  }

  const columns = [
    { key: 'name', label: 'Outlet Name' },
    { key: 'brand_name', label: 'Brand' },
    { key: 'floor', label: 'Floor' },
    { key: 'shop_number', label: 'Shop No.' },
    { key: 'contact_number', label: 'Contact' },
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
          <h1 className="text-2xl font-bold text-slate-800">Outlets</h1>
          <p className="text-slate-500 text-sm mt-1">{total} total outlets</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} />
          Add Outlet
        </button>
      </div>

      <div className="mb-4 max-w-sm">
        <SearchBar
          value={search}
          onChange={(val) => { setSearch(val); setCurrentPage(1) }}
          placeholder="Search outlets..."
        />
      </div>

      <Table columns={columns} data={outlets} loading={loading} emptyMessage="No outlets found" />
      <Pagination page={currentPage} limit={limit} total={total} onPageChange={setCurrentPage} />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Outlet' : 'Add Outlet'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Brand</label>
            <select
              value={form.brand_id}
              onChange={(e) => setForm({ ...form, brand_id: e.target.value })}
              required
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a brand</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {[
            { label: 'Outlet Name', key: 'name', type: 'text', required: true },
            { label: 'Floor', key: 'floor', type: 'text' },
            { label: 'Shop Number', key: 'shop_number', type: 'text' },
            { label: 'Contact Number', key: 'contact_number', type: 'text' },
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

export default Outlets