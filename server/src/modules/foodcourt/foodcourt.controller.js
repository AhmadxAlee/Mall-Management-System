import { query } from '../../config/db.js'
import AppError from '../../utils/AppError.js'
import catchAsync from '../../utils/catchAsync.js'

// ─── Food Courts ───────────────────────────────────────────

export const getAllFoodCourts = catchAsync(async (req, res) => {
  const { search, floor, page = 1, limit = 10, sortBy = 'created_at', order = 'DESC' } = req.query

  const offset = (page - 1) * limit
  const conditions = ['fc.is_active = true']
  const params = []

  if (search) {
    params.push(`%${search}%`)
    conditions.push(`fc.name ILIKE $${params.length}`)
  }

  if (floor) {
    params.push(floor)
    conditions.push(`fc.floor = $${params.length}`)
  }

  const where = `WHERE ${conditions.join(' AND ')}`
  const validSortFields = ['name', 'floor', 'total_stalls', 'created_at']
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at'
  const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

  const countResult = await query(`SELECT COUNT(*) FROM food_courts fc ${where}`, params)

  params.push(limit, offset)
  const { rows } = await query(
    `SELECT fc.* FROM food_courts fc ${where}
     ORDER BY fc.${sortField} ${sortOrder}
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  )

  res.status(200).json({
    status: 'success',
    total: parseInt(countResult.rows[0].count),
    page: parseInt(page),
    limit: parseInt(limit),
    data: { foodCourts: rows },
  })
})

export const getFoodCourt = catchAsync(async (req, res, next) => {
  const { rows } = await query(
    `SELECT fc.*,
      json_agg(fs.*) FILTER (WHERE fs.id IS NOT NULL) as stalls
     FROM food_courts fc
     LEFT JOIN food_stalls fs ON fs.food_court_id = fc.id AND fs.is_active = true
     WHERE fc.id = $1 AND fc.is_active = true
     GROUP BY fc.id`,
    [req.params.id]
  )

  if (!rows.length) {
    return next(new AppError('Food court not found', 404))
  }

  res.status(200).json({
    status: 'success',
    data: { foodCourt: rows[0] },
  })
})

export const createFoodCourt = catchAsync(async (req, res) => {
  const { name, floor, total_stalls } = req.body

  const { rows } = await query(
    `INSERT INTO food_courts (name, floor, total_stalls)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, floor, total_stalls]
  )

  res.status(201).json({
    status: 'success',
    data: { foodCourt: rows[0] },
  })
})

export const updateFoodCourt = catchAsync(async (req, res, next) => {
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
    `UPDATE food_courts SET ${fields.join(', ')}
     WHERE id = $${params.length} AND is_active = true
     RETURNING *`,
    params
  )

  if (!rows.length) {
    return next(new AppError('Food court not found', 404))
  }

  res.status(200).json({
    status: 'success',
    data: { foodCourt: rows[0] },
  })
})

export const deleteFoodCourt = catchAsync(async (req, res, next) => {
  const { rows } = await query(
    `UPDATE food_courts SET is_active = false, updated_at = NOW()
     WHERE id = $1 AND is_active = true
     RETURNING id`,
    [req.params.id]
  )

  if (!rows.length) {
    return next(new AppError('Food court not found', 404))
  }

  res.status(200).json({
    status: 'success',
    message: 'Food court deleted successfully',
  })
})

// ─── Food Stalls ───────────────────────────────────────────

export const getAllStalls = catchAsync(async (req, res) => {
  const { rows } = await query(
    `SELECT fs.*, e.name as manager_name
     FROM food_stalls fs
     LEFT JOIN employees e ON e.id = fs.manager_id
     WHERE fs.food_court_id = $1 AND fs.is_active = true`,
    [req.params.id]
  )

  res.status(200).json({
    status: 'success',
    data: { stalls: rows },
  })
})

export const createStall = catchAsync(async (req, res) => {
  const { food_court_id, name, cuisine_type, contact_number, manager_id } = req.body

  const { rows } = await query(
    `INSERT INTO food_stalls (food_court_id, name, cuisine_type, contact_number, manager_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [food_court_id, name, cuisine_type, contact_number, manager_id]
  )

  res.status(201).json({
    status: 'success',
    data: { stall: rows[0] },
  })
})

export const updateStall = catchAsync(async (req, res, next) => {
  const fields = []
  const params = []

  Object.entries(req.body).forEach(([key, value]) => {
    params.push(value)
    fields.push(`${key} = $${params.length}`)
  })

  if (!fields.length) {
    return next(new AppError('No fields to update', 400))
  }

  params.push(new Date(), req.params.stallId)
  fields.push(`updated_at = $${params.length - 1}`)

  const { rows } = await query(
    `UPDATE food_stalls SET ${fields.join(', ')}
     WHERE id = $${params.length} AND is_active = true
     RETURNING *`,
    params
  )

  if (!rows.length) {
    return next(new AppError('Stall not found', 404))
  }

  res.status(200).json({
    status: 'success',
    data: { stall: rows[0] },
  })
})

export const deleteStall = catchAsync(async (req, res, next) => {
  const { rows } = await query(
    `UPDATE food_stalls SET is_active = false, updated_at = NOW()
     WHERE id = $1 AND is_active = true
     RETURNING id`,
    [req.params.stallId]
  )

  if (!rows.length) {
    return next(new AppError('Stall not found', 404))
  }

  res.status(200).json({
    status: 'success',
    message: 'Stall deleted successfully',
  })
})