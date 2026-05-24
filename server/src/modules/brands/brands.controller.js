import { query } from '../../config/db.js'
import AppError from '../../utils/AppError.js'
import catchAsync from '../../utils/catchAsync.js'

// ─── Brands ───────────────────────────────────────────────

export const getAllBrands = catchAsync(async (req, res) => {
  const { search, category, page = 1, limit = 10, sortBy = 'created_at', order = 'DESC' } = req.query

  const offset = (page - 1) * limit
  const conditions = ['b.is_active = true']
  const params = []

  if (search) {
    params.push(`%${search}%`)
    conditions.push(`b.name ILIKE $${params.length}`)
  }

  if (category) {
    params.push(`%${category}%`)
    conditions.push(`b.category ILIKE $${params.length}`)
  }

  const where = `WHERE ${conditions.join(' AND ')}`
  const validSortFields = ['name', 'category', 'created_at']
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at'
  const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

  const countResult = await query(`SELECT COUNT(*) FROM brands b ${where}`, params)

  params.push(limit, offset)
  const { rows } = await query(
    `SELECT b.* FROM brands b ${where}
     ORDER BY b.${sortField} ${sortOrder}
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  )

  res.status(200).json({
    status: 'success',
    total: parseInt(countResult.rows[0].count),
    page: parseInt(page),
    limit: parseInt(limit),
    data: { brands: rows },
  })
})

export const getBrand = catchAsync(async (req, res, next) => {
  const { rows } = await query(
    `SELECT b.*, 
      json_agg(bc.*) FILTER (WHERE bc.id IS NOT NULL) as chains
     FROM brands b
     LEFT JOIN brand_chains bc ON bc.brand_id = b.id AND bc.is_active = true
     WHERE b.id = $1 AND b.is_active = true
     GROUP BY b.id`,
    [req.params.id]
  )

  if (!rows.length) {
    return next(new AppError('Brand not found', 404))
  }

  res.status(200).json({
    status: 'success',
    data: { brand: rows[0] },
  })
})

export const createBrand = catchAsync(async (req, res) => {
  const { name, description, logo_url, category } = req.body

  const { rows } = await query(
    `INSERT INTO brands (name, description, logo_url, category)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, description, logo_url, category]
  )

  res.status(201).json({
    status: 'success',
    data: { brand: rows[0] },
  })
})

export const updateBrand = catchAsync(async (req, res, next) => {
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
    `UPDATE brands SET ${fields.join(', ')}
     WHERE id = $${params.length} AND is_active = true
     RETURNING *`,
    params
  )

  if (!rows.length) {
    return next(new AppError('Brand not found', 404))
  }

  res.status(200).json({
    status: 'success',
    data: { brand: rows[0] },
  })
})

export const deleteBrand = catchAsync(async (req, res, next) => {
  const { rows } = await query(
    `UPDATE brands SET is_active = false, updated_at = NOW()
     WHERE id = $1 AND is_active = true
     RETURNING id`,
    [req.params.id]
  )

  if (!rows.length) {
    return next(new AppError('Brand not found', 404))
  }

  res.status(200).json({
    status: 'success',
    message: 'Brand deleted successfully',
  })
})

// ─── Brand Chains ─────────────────────────────────────────

export const getChainsByBrand = catchAsync(async (req, res) => {
  const { rows } = await query(
    `SELECT bc.*, e.name as manager_name 
     FROM brand_chains bc
     LEFT JOIN employees e ON e.id = bc.manager_id
     WHERE bc.brand_id = $1 AND bc.is_active = true`,
    [req.params.id]
  )

  res.status(200).json({
    status: 'success',
    data: { chains: rows },
  })
})

export const createChain = catchAsync(async (req, res) => {
  const { brand_id, name, region, manager_id } = req.body

  const { rows } = await query(
    `INSERT INTO brand_chains (brand_id, name, region, manager_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [brand_id, name, region, manager_id]
  )

  res.status(201).json({
    status: 'success',
    data: { chain: rows[0] },
  })
})

export const updateChain = catchAsync(async (req, res, next) => {
  const fields = []
  const params = []

  Object.entries(req.body).forEach(([key, value]) => {
    params.push(value)
    fields.push(`${key} = $${params.length}`)
  })

  if (!fields.length) {
    return next(new AppError('No fields to update', 400))
  }

  params.push(new Date(), req.params.chainId)
  fields.push(`updated_at = $${params.length - 1}`)

  const { rows } = await query(
    `UPDATE brand_chains SET ${fields.join(', ')}
     WHERE id = $${params.length} AND is_active = true
     RETURNING *`,
    params
  )

  if (!rows.length) {
    return next(new AppError('Chain not found', 404))
  }

  res.status(200).json({
    status: 'success',
    data: { chain: rows[0] },
  })
})

export const deleteChain = catchAsync(async (req, res, next) => {
  const { rows } = await query(
    `UPDATE brand_chains SET is_active = false, updated_at = NOW()
     WHERE id = $1 AND is_active = true
     RETURNING id`,
    [req.params.chainId]
  )

  if (!rows.length) {
    return next(new AppError('Chain not found', 404))
  }

  res.status(200).json({
    status: 'success',
    message: 'Chain deleted successfully',
  })
})