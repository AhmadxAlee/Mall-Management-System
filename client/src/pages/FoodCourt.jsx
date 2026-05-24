import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  fetchFoodCourts,
  createFoodCourt,
  updateFoodCourt,
  deleteFoodCourt,
} from '../features/foodcourt/foodCourtSlice'
import Table from '../components/ui/Table'
import SearchBar from '../components/ui/SearchBar'
import Pagination from '../components/ui/Pagination'
import Modal from '../components/ui/Modal'

const emptyForm = { name: '', floor: '', total_stalls: '' }

const FoodCourt = () => {
  const dispatch = useDispatch()
  const { foodCourts, total, page, limit, loading } = useSelector((state) => state.foodCourt)

  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    dispatch(fetchFoodCourts({ search, page: currentPage, limit: 10 }))
  }, [dispatch, search, currentPage])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (fc) => {
    setEditing(fc)
    setForm({
      name: fc.name,
      floor: fc.floor || '',
      total_stalls: fc.total_stalls || '',
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      total_stalls: form.total_stalls ? Number(form.total_stalls) : undefined,
    }

    if (editing) {
      const res = await dispatch(updateFoodCourt({ id: editing.id, ...payload }))
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('Food court updated')
        setModalOpen(false)
      } else {
        toast.error(res.payload)
      }
    } else {
      const res = await dispatch(createFoodCourt(payload))
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('Food court created')
        setModalOpen(false)
      } else {
        toast.error(res.payload)
      }
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this food court?')) return
    const res = await dispatch(deleteFoodCourt(id))
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Food court deleted')
    } else {
      toast.error(res.payload)
    }
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'floor', label: 'Floor' },
    { key: 'total_stalls', label: 'Total Stalls' },
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
          <h1 className="text-2xl font-bold text-slate-800">Food Court</h1>
          <p className="text-slate-500 text-sm mt-1">{total} total food courts</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} />
          Add Food Court
        </button>
      </div>

      <div className="mb-4 max-w-sm">
        <SearchBar
          value={search}
          onChange={(val) => { setSearch(val); setCurrentPage(1) }}
          placeholder="Search food courts..."
        />
      </div>

      <Table columns={columns} data={foodCourts} loading={loading} emptyMessage="No food courts found" />
      <Pagination page={currentPage} limit={limit} total={total} onPageChange={setCurrentPage} />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Food Court' : 'Add Food Court'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Name', key: 'name', type: 'text', required: true },
            { label: 'Floor', key: 'floor', type: 'text' },
            { label: 'Total Stalls', key: 'total_stalls', type: 'number' },
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

export default FoodCourt