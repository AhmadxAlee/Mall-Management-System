import { query } from '../../config/db.js'
import AppError from '../../utils/AppError.js'
import catchAsync from '../../utils/catchAsync.js'

export const getAllOutlets = catchAsync(async (req, res) => {
  const { search, brand_id, floor, page = 1, limit = 10, sortBy = 'created_at', order = 'DESC' } = req.query

  const offset = (page - 1) * limit
  const conditions = ['o.is_active = true']
  const params = []

  if (search) {
    params.push(`%${search}%`)
    conditions.push(`(o.name ILIKE $${params.length} OR o.shop_number ILIKE $${params.length})`)
  }

  if (brand_id) {
    params.push(brand_id)
    conditions.push(`o.brand_id = $${params.length}`)
  }

  if (floor) {
    params.push(floor)
    conditions.push(`o.floor = $${params.length}`)
  }

  const where = `WHERE ${conditions.join(' AND ')}`
  const validSortFields = ['name', 'floor', 'shop_number', 'created_at']
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at'
  const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

  const countResult = await query(`SELECT COUNT(*) FROM outlets o ${where}`, params)

  params.push(limit, offset)
  const { rows } = await query(
    `SELECT o.*, b.name as brand_name, e.name as manager_name
     FROM outlets o
     LEFT JOIN brands b ON b.id = o.brand_id
     LEFT JOIN employees e ON e.id = o.manager_id
     ${where}
     ORDER BY o.${sortField} ${sortOrder}
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  )

  res.status(200).json({
    status: 'success',
    total: parseInt(countResult.rows[0].count),
    page: parseInt(page),
    limit: parseInt(limit),
    data: { outlets: rows },
  })
})

export const getOutlet = catchAsync(async (req, res, next) => {
  const { rows } = await query(
    `SELECT o.*, b.name as brand_name, e.name as manager_name
     FROM outlets o
     LEFT JOIN brands b ON b.id = o.brand_id
     LEFT JOIN employees e ON e.id = o.manager_id
     WHERE o.id = $1 AND o.is_active = true`,
    [req.params.id]
  )

  if (!rows.length) {
    return next(new AppError('Outlet not found', 404))
  }

  res.status(200).json({
    status: 'success',
    data: { outlet: rows[0] },
  })
})

export const createOutlet = catchAsync(async (req, res) => {
  const { brand_id, chain_id, name, floor, shop_number, contact_number, manager_id } = req.body

  const { rows } = await query(
    `INSERT INTO outlets (brand_id, chain_id, name, floor, shop_number, contact_number, manager_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [brand_id, chain_id, name, floor, shop_number, contact_number, manager_id]
  )

  res.status(201).json({
    status: 'success',
    data: { outlet: rows[0] },
  })
})

export const updateOutlet = catchAsync(async (req, res, next) => {
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
    `UPDATE outlets SET ${fields.join(', ')}
     WHERE id = $${params.length} AND is_active = true
     RETURNING *`,
    params
  )

  if (!rows.length) {
    return next(new AppError('Outlet not found', 404))
  }

  res.status(200).json({
    status: 'success',
    data: { outlet: rows[0] },
  })
})

export const deleteOutlet = catchAsync(async (req, res, next) => {
  const { rows } = await query(
    `UPDATE outlets SET is_active = false, updated_at = NOW()
     WHERE id = $1 AND is_active = true
     RETURNING id`,
    [req.params.id]
  )

  if (!rows.length) {
    return next(new AppError('Outlet not found', 404))
  }

  res.status(200).json({
    status: 'success',
    message: 'Outlet deleted successfully',
  })
})