import { query } from '../../config/db.js'
import AppError from '../../utils/AppError.js'
import catchAsync from '../../utils/catchAsync.js'

export const getAllEmployees = catchAsync(async (req, res) => {
  const { search, role, department, page = 1, limit = 10, sortBy = 'created_at', order = 'DESC' } = req.query

  const offset = (page - 1) * limit
  const conditions = ['e.is_active = true']
  const params = []

  if (search) {
    params.push(`%${search}%`)
    conditions.push(`(e.name ILIKE $${params.length} OR e.email ILIKE $${params.length})`)
  }

  if (role) {
    params.push(role)
    conditions.push(`e.role = $${params.length}`)
  }

  if (department) {
    params.push(`%${department}%`)
    conditions.push(`e.department ILIKE $${params.length}`)
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  const validSortFields = ['name', 'email', 'role', 'department', 'salary', 'hire_date', 'created_at']
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at'
  const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

  const countResult = await query(
    `SELECT COUNT(*) FROM employees e ${where}`,
    params
  )

  params.push(limit, offset)
  const { rows } = await query(
    `SELECT e.* FROM employees e ${where}
     ORDER BY e.${sortField} ${sortOrder}
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  )

  res.status(200).json({
    status: 'success',
    total: parseInt(countResult.rows[0].count),
    page: parseInt(page),
    limit: parseInt(limit),
    data: { employees: rows },
  })
})

export const getEmployee = catchAsync(async (req, res, next) => {
  const { rows } = await query(
    'SELECT * FROM employees WHERE id = $1 AND is_active = true',
    [req.params.id]
  )

  if (!rows.length) {
    return next(new AppError('Employee not found', 404))
  }

  res.status(200).json({
    status: 'success',
    data: { employee: rows[0] },
  })
})

export const createEmployee = catchAsync(async (req, res) => {
  const { name, email, phone, role, department, salary, hire_date } = req.body

  const { rows } = await query(
    `INSERT INTO employees (name, email, phone, role, department, salary, hire_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [name, email, phone, role, department, salary, hire_date]
  )

  res.status(201).json({
    status: 'success',
    data: { employee: rows[0] },
  })
})

export const updateEmployee = catchAsync(async (req, res, next) => {
  const fields = []
  const params = []

  Object.entries(req.body).forEach(([key, value]) => {
    params.push(value)
    fields.push(`${key} = $${params.length}`)
  })

  if (!fields.length) {
    return next(new AppError('No fields to update', 400))
  }

  params.push(new Date(), req.params.id)
  fields.push(`updated_at = $${params.length - 1}`)

  const { rows } = await query(
    `UPDATE employees SET ${fields.join(', ')}
     WHERE id = $${params.length} AND is_active = true
     RETURNING *`,
    params
  )

  if (!rows.length) {
    return next(new AppError('Employee not found', 404))
  }

  res.status(200).json({
    status: 'success',
    data: { employee: rows[0] },
  })
})

export const deleteEmployee = catchAsync(async (req, res, next) => {
  const { rows } = await query(
    `UPDATE employees SET is_active = false, updated_at = NOW()
     WHERE id = $1 AND is_active = true
     RETURNING id`,
    [req.params.id]
  )

  if (!rows.length) {
    return next(new AppError('Employee not found', 404))
  }

  res.status(200).json({
    status: 'success',
    message: 'Employee deleted successfully',
  })
})