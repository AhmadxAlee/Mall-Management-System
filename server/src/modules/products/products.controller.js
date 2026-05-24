import { query } from '../../config/db.js'
import AppError from '../../utils/AppError.js'
import catchAsync from '../../utils/catchAsync.js'

export const getAllProducts = catchAsync(async (req, res) => {
  const { search, category, outlet_id, low_stock, page = 1, limit = 10, sortBy = 'created_at', order = 'DESC' } = req.query

  const offset = (page - 1) * limit
  const conditions = ['p.is_active = true']
  const params = []

  if (search) {
    params.push(`%${search}%`)
    conditions.push(`(p.name ILIKE $${params.length} OR p.sku ILIKE $${params.length})`)
  }

  if (category) {
    params.push(`%${category}%`)
    conditions.push(`p.category ILIKE $${params.length}`)
  }

  if (outlet_id) {
    params.push(outlet_id)
    conditions.push(`p.outlet_id = $${params.length}`)
  }

  if (low_stock === 'true') {
    conditions.push(`i.quantity <= i.min_stock_level`)
  }

  const where = `WHERE ${conditions.join(' AND ')}`
  const validSortFields = ['name', 'price', 'category', 'created_at']
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at'
  const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

  const countResult = await query(
    `SELECT COUNT(*) FROM products p
     LEFT JOIN inventory i ON i.product_id = p.id
     ${where}`,
    params
  )

  params.push(limit, offset)
  const { rows } = await query(
    `SELECT p.*, i.quantity, i.min_stock_level, i.last_restocked,
            o.name as outlet_name
     FROM products p
     LEFT JOIN inventory i ON i.product_id = p.id
     LEFT JOIN outlets o ON o.id = p.outlet_id
     ${where}
     ORDER BY p.${sortField} ${sortOrder}
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  )

  res.status(200).json({
    status: 'success',
    total: parseInt(countResult.rows[0].count),
    page: parseInt(page),
    limit: parseInt(limit),
    data: { products: rows },
  })
})

export const getProduct = catchAsync(async (req, res, next) => {
  const { rows } = await query(
    `SELECT p.*, i.quantity, i.min_stock_level, i.last_restocked,
            o.name as outlet_name
     FROM products p
     LEFT JOIN inventory i ON i.product_id = p.id
     LEFT JOIN outlets o ON o.id = p.outlet_id
     WHERE p.id = $1 AND p.is_active = true`,
    [req.params.id]
  )

  if (!rows.length) {
    return next(new AppError('Product not found', 404))
  }

  res.status(200).json({
    status: 'success',
    data: { product: rows[0] },
  })
})

export const createProduct = catchAsync(async (req, res) => {
  const { outlet_id, name, description, price, category, sku, quantity, min_stock_level } = req.body

  const { rows } = await query(
    `INSERT INTO products (outlet_id, name, description, price, category, sku)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [outlet_id, name, description, price, category, sku]
  )

  const product = rows[0]

  await query(
    `INSERT INTO inventory (product_id, quantity, min_stock_level)
     VALUES ($1, $2, $3)`,
    [product.id, quantity, min_stock_level]
  )

  res.status(201).json({
    status: 'success',
    data: { product: { ...product, quantity, min_stock_level } },
  })
})

export const updateProduct = catchAsync(async (req, res, next) => {
  const { quantity, min_stock_level, ...productFields } = req.body

  if (Object.keys(productFields).length) {
    const fields = []
    const params = []

    Object.entries(productFields).forEach(([key, value]) => {
      params.push(value)
      fields.push(`${key} = $${params.length}`)
    })

    params.push(new Date(), req.params.id)
    fields.push(`updated_at = $${params.length - 1}`)

    const { rows } = await query(
      `UPDATE products SET ${fields.join(', ')}
       WHERE id = $${params.length} AND is_active = true
       RETURNING *`,
      params
    )

    if (!rows.length) {
      return next(new AppError('Product not found', 404))
    }
  }

  if (quantity !== undefined || min_stock_level !== undefined) {
    const invFields = []
    const invParams = []

    if (quantity !== undefined) {
      invParams.push(quantity)
      invFields.push(`quantity = $${invParams.length}`)
    }
    if (min_stock_level !== undefined) {
      invParams.push(min_stock_level)
      invFields.push(`min_stock_level = $${invParams.length}`)
    }

    invParams.push(new Date(), req.params.id)
    invFields.push(`updated_at = $${invParams.length - 1}`)

    await query(
      `UPDATE inventory SET ${invFields.join(', ')}
       WHERE product_id = $${invParams.length}`,
      invParams
    )
  }

  const { rows: updated } = await query(
    `SELECT p.*, i.quantity, i.min_stock_level, i.last_restocked
     FROM products p
     LEFT JOIN inventory i ON i.product_id = p.id
     WHERE p.id = $1`,
    [req.params.id]
  )

  res.status(200).json({
    status: 'success',
    data: { product: updated[0] },
  })
})

export const deleteProduct = catchAsync(async (req, res, next) => {
  const { rows } = await query(
    `UPDATE products SET is_active = false, updated_at = NOW()
     WHERE id = $1 AND is_active = true
     RETURNING id`,
    [req.params.id]
  )

  if (!rows.length) {
    return next(new AppError('Product not found', 404))
  }

  res.status(200).json({
    status: 'success',
    message: 'Product deleted successfully',
  })
})

export const getLowStockProducts = catchAsync(async (req, res) => {
  const { rows } = await query(
    `SELECT p.*, i.quantity, i.min_stock_level, o.name as outlet_name
     FROM products p
     LEFT JOIN inventory i ON i.product_id = p.id
     LEFT JOIN outlets o ON o.id = p.outlet_id
     WHERE p.is_active = true AND i.quantity <= i.min_stock_level
     ORDER BY i.quantity ASC`
  )

  res.status(200).json({
    status: 'success',
    total: rows.length,
    data: { products: rows },
  })
})