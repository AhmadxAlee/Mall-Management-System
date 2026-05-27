import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { fetchEmployees, createEmployee, updateEmployee, deleteEmployee } from '../features/employees/employeeSlice'
import Table from '../components/ui/Table'
import SearchBar from '../components/ui/SearchBar'
import Pagination from '../components/ui/Pagination'
import Modal from '../components/ui/Modal'
import Badge from '../components/ui/Badge'

const roleColor = { admin: 'rose', manager: 'indigo', employee: 'emerald' }
const emptyForm = { name: '', email: '', phone: '', role: 'employee', department: '', salary: '', hire_date: '' }
const iClass = "w-full px-3 py-2.5 text-sm rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 transition-all"
const iStyle = { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' }

const Employees = () => {
  const dispatch = useDispatch()
  const { employees, total, page, limit, loading } = useSelector((state) => state.employees)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => { dispatch(fetchEmployees({ search, page: currentPage, limit: 10 })) }, [dispatch, search, currentPage])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (emp) => {
    setEditing(emp)
    setForm({ name: emp.name, email: emp.email, phone: emp.phone || '', role: emp.role, department: emp.department || '', salary: emp.salary || '', hire_date: emp.hire_date?.split('T')[0] || '' })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form, salary: form.salary ? Number(form.salary) : undefined }
    const action = editing ? updateEmployee({ id: editing.id, ...payload }) : createEmployee(payload)
    const res = await dispatch(action)
    if (res.meta.requestStatus === 'fulfilled') { toast.success(editing ? 'Employee updated' : 'Employee created'); setModalOpen(false) }
    else toast.error(res.payload)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return
    const res = await dispatch(deleteEmployee(id))
    if (res.meta.requestStatus === 'fulfilled') toast.success('Employee deleted')
    else toast.error(res.payload)
  }

  const columns = [
    {
      key: 'name', label: 'Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: '#c026d3' }}>
            {row.name.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-white">{row.name}</span>
        </div>
      ),
    },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Department' },
    { key: 'role', label: 'Role', render: (row) => <Badge label={row.role} color={roleColor[row.role]} /> },
    { key: 'salary', label: 'Salary', render: (row) => row.salary ? `PKR ${Number(row.salary).toLocaleString()}` : '—' },
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
            <Users size={19} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Employees</h1>
            <p className="text-sm text-white/40">{total} total</p>
          </div>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90" style={{ background: '#c026d3' }}>
          <Plus size={15} /> Add Employee
        </button>
      </motion.div>

      <div className="mb-4 max-w-sm">
        <SearchBar value={search} onChange={(val) => { setSearch(val); setCurrentPage(1) }} placeholder="Search employees..." />
      </div>

      <Table columns={columns} data={employees} loading={loading} emptyMessage="No employees found" />
      <Pagination page={currentPage} limit={limit} total={total} onPageChange={setCurrentPage} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Employee' : 'Add Employee'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Full Name', key: 'name', type: 'text', required: true },
            { label: 'Email', key: 'email', type: 'email', required: true },
            { label: 'Phone', key: 'phone', type: 'text' },
            { label: 'Department', key: 'department', type: 'text' },
            { label: 'Salary', key: 'salary', type: 'number' },
            { label: 'Hire Date', key: 'hire_date', type: 'date' },
          ].map(({ label, key, type, required }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-white/50 mb-1">{label}</label>
              <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required={required} className={iClass} style={iStyle} />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1">Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={iClass} style={iStyle}>
              <option value="employee" style={{ background: '#1a0a2e' }}>Employee</option>
              <option value="manager" style={{ background: '#1a0a2e' }}>Manager</option>
              <option value="admin" style={{ background: '#1a0a2e' }}>Admin</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 text-sm rounded-xl text-white/50 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 text-sm rounded-xl text-white font-medium" style={{ background: '#c026d3' }}>{editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Employees